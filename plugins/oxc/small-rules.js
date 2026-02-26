// @bun
// node_modules/@oxlint/plugins/index.js
function definePlugin(plugin) {
  return plugin;
}
function defineRule(rule) {
  return rule;
}
var FILE_CONTEXT = Object.freeze({
  get filename() {
    throw Error("Cannot access `context.filename` in `createOnce`");
  },
  getFilename() {
    throw Error("Cannot call `context.getFilename` in `createOnce`");
  },
  get physicalFilename() {
    throw Error("Cannot access `context.physicalFilename` in `createOnce`");
  },
  getPhysicalFilename() {
    throw Error("Cannot call `context.getPhysicalFilename` in `createOnce`");
  },
  get cwd() {
    throw Error("Cannot access `context.cwd` in `createOnce`");
  },
  getCwd() {
    throw Error("Cannot call `context.getCwd` in `createOnce`");
  },
  get sourceCode() {
    throw Error("Cannot access `context.sourceCode` in `createOnce`");
  },
  getSourceCode() {
    throw Error("Cannot call `context.getSourceCode` in `createOnce`");
  },
  get languageOptions() {
    throw Error("Cannot access `context.languageOptions` in `createOnce`");
  },
  get settings() {
    throw Error("Cannot access `context.settings` in `createOnce`");
  },
  extend(extension) {
    return Object.freeze(Object.assign(Object.create(this), extension));
  },
  get parserOptions() {
    throw Error("Cannot access `context.parserOptions` in `createOnce`");
  },
  get parserPath() {
    throw Error("Cannot access `context.parserPath` in `createOnce`");
  }
});

// plugins/oxc/typescript/small-rules/require-named-effect-functions.ts
var hooks = [
  { allowAsync: false, name: "useEffect" },
  { allowAsync: false, name: "useLayoutEffect" },
  { allowAsync: false, name: "useInsertionEffect" }
];
var hookAsyncConfiguration = new Map(hooks.map((hookConfig) => [hookConfig.name, hookConfig.allowAsync]));
var effectHooks = new Set(hookAsyncConfiguration.keys());
function isAsyncAllowed(hookName) {
  const result = hookAsyncConfiguration.get(hookName);
  return typeof result === "boolean" ? result : false;
}
function getHookName(callExpression) {
  const { callee } = callExpression;
  if (callee.type === "Identifier" && typeof callee.name === "string" && callee.name.length > 0) {
    return callee.name;
  }
  if (callee.type === "MemberExpression" && callee.property.type === "Identifier" && typeof callee.property.name === "string" && callee.property.name.length > 0) {
    return callee.property.name;
  }
  return;
}
function findVariableInScope(identifier, scope) {
  let variable;
  let currentScope = scope;
  while (typeof currentScope === "object" && currentScope !== null) {
    variable = currentScope.set.get(identifier.name);
    if (!variable)
      break;
    currentScope = currentScope.upper;
  }
  return variable ?? undefined;
}
function processFunctionDeclaration(node) {
  return { isAsync: Boolean(node.async), node, type: "function-declaration" };
}
function processArrowFunction(node) {
  return { isAsync: Boolean(node.async), node, type: "arrow" };
}
function processFunctionExpression(node) {
  return { isAsync: Boolean(node.async), node, type: "function-expression" };
}
function checkVariableDeclaratorDef(node) {
  if (node.type !== "VariableDeclarator")
    return;
  const { init } = node;
  if (init?.type === "ArrowFunctionExpression")
    return processArrowFunction(init);
  if (init?.type === "FunctionExpression")
    return processFunctionExpression(init);
  return;
}
function processSingleDefinition(definition) {
  if (definition === null || definition === undefined)
    return;
  const { node } = definition;
  return node.type === "FunctionDeclaration" ? processFunctionDeclaration(node) : checkVariableDeclaratorDef(node);
}
function resolveIdentifierToFunction(identifier, context) {
  try {
    const scope = context.sourceCode.getScope(identifier);
    const variable = findVariableInScope(identifier, scope);
    if (!variable || variable.defs.length === 0)
      return;
    for (const definition of variable.defs) {
      const result = processSingleDefinition(definition);
      if (!result)
        return result;
    }
    return;
  } catch {
    return;
  }
}
function isCallbackHookResult(identifier, context) {
  try {
    const scope = context.sourceCode.getScope(identifier);
    let variable;
    let currentScope = scope;
    while (typeof currentScope === "object" && currentScope !== null) {
      variable = currentScope.set.get(identifier.name);
      if (!variable)
        break;
      currentScope = currentScope.upper;
    }
    if (!variable || variable.defs.length === 0)
      return false;
    for (const definition of variable.defs) {
      const { node } = definition;
      if (node.type !== "VariableDeclarator")
        continue;
      const { init } = node;
      if (init?.type !== "CallExpression")
        continue;
      const calleeHookName = getHookName(init);
      if (calleeHookName === "useCallback" || calleeHookName === "useMemo")
        return true;
    }
    return false;
  } catch {
    return false;
  }
}
var requireNamedEffectFunctions = defineRule({
  create(context) {
    return {
      CallExpression: (node) => {
        if (node.type !== "CallExpression")
          return;
        const hookName = getHookName(node);
        if (!hookName || !effectHooks.has(hookName))
          return;
        const [argumentNode] = node.arguments;
        if (argumentNode.type === "Identifier") {
          const resolved = resolveIdentifierToFunction(argumentNode, context);
          if (!resolved) {
            if (isCallbackHookResult(argumentNode, context)) {
              context.report({
                data: { hook: hookName },
                messageId: "identifierReferencesCallback",
                node
              });
            }
            return;
          }
          if (resolved.type === "arrow") {
            if (resolved.isAsync) {
              if (!isAsyncAllowed(hookName)) {
                context.report({
                  data: { hook: hookName },
                  messageId: "identifierReferencesAsyncArrow",
                  node
                });
              }
            } else {
              context.report({
                data: { hook: hookName },
                messageId: "identifierReferencesArrow",
                node
              });
            }
          } else if (resolved.type === "function-expression") {
            if (!resolved.node.id) {
              context.report({
                data: { hook: hookName },
                messageId: "anonymousFunction",
                node
              });
            }
          } else if (resolved.type === "function-declaration" && resolved.isAsync && !isAsyncAllowed(hookName)) {
            context.report({
              data: { hook: hookName },
              messageId: "identifierReferencesAsyncFunction",
              node
            });
          }
          return;
        }
        if (argumentNode.type === "ArrowFunctionExpression") {
          if (argumentNode.async) {
            context.report({
              data: { hook: hookName },
              messageId: "asyncArrowFunction",
              node
            });
          } else {
            context.report({
              data: { hook: hookName },
              messageId: "arrowFunction",
              node
            });
          }
          return;
        }
        if (argumentNode.type === "FunctionExpression") {
          const functionHasId = Boolean(argumentNode.id);
          if (functionHasId && argumentNode.async) {
            context.report({
              data: { hook: hookName },
              messageId: "asyncFunctionExpression",
              node
            });
          } else if (!functionHasId && argumentNode.async) {
            context.report({
              data: { hook: hookName },
              messageId: "asyncAnonymousFunction",
              node
            });
          } else if (!functionHasId) {
            context.report({
              data: { hook: hookName },
              messageId: "anonymousFunction",
              node
            });
          }
        }
      }
    };
  },
  meta: {
    docs: {
      description: "Enforce named effect functions for better debuggability. Prevents inline arrow functions in useEffect and similar hooks.",
      recommended: false
    },
    messages: {
      anonymousFunction: "Anonymous function passed to {{hook}}. debug.info returns empty string for anonymous functions, making stack traces useless for debugging. Extract to: function effectName() { ... } then pass effectName.",
      arrowFunction: "Arrow function passed to {{hook}}. Arrow functions have no debug name and create new instances each render. Extract to: function effectName() { ... } then pass effectName.",
      asyncAnonymousFunction: "Async anonymous function in {{hook}}. Two issues: (1) no debug name makes stack traces useless, (2) async effects require cancellation logic for unmount. Extract to: async function effectName() { ... } with cleanup.",
      asyncArrowFunction: "Async arrow function in {{hook}}. Two issues: (1) arrow functions have no debug name, (2) async effects require cancellation logic. Extract to: async function effectName() { ... } with cleanup.",
      asyncFunctionDeclaration: "Async function declaration passed to {{hook}}. Async effects require cancellation logic to handle component unmount. Implement cleanup or set allowAsync: true if cancellation is handled.",
      asyncFunctionExpression: "Async function expression in {{hook}}. Async effects require cancellation logic for unmount. Extract to a named async function declaration with cleanup, then pass the reference.",
      functionExpression: "Function expression passed to {{hook}}. Function expressions create new instances each render, breaking referential equality. Extract to: function effectName() { ... } at module or component top-level.",
      identifierReferencesArrow: "{{hook}} receives identifier pointing to arrow function. Arrow functions have no debug name and lack referential stability. Convert to: function effectName() { ... } then pass effectName.",
      identifierReferencesAsyncArrow: "{{hook}} receives identifier pointing to async arrow function. Two issues: (1) no debug name, (2) async effects require cancellation logic. Convert to: async function effectName() { ... } with cleanup.",
      identifierReferencesAsyncFunction: "{{hook}} receives identifier pointing to async function. Async effects require cancellation logic for unmount. Implement cleanup or set allowAsync: true if cancellation is handled.",
      identifierReferencesCallback: "{{hook}} receives identifier from useCallback/useMemo. These hooks return new references when dependencies change, causing unexpected effect re-runs. Use a stable function declaration: function effectName() { ... }"
    },
    type: "problem"
  }
});
var require_named_effect_functions_default = requireNamedEffectFunctions;

// plugins/oxc/typescript/small-rules/index.ts
var smallRules = definePlugin({
  meta: {
    name: "small-rules"
  },
  rules: {
    "require-named-effect-functions": require_named_effect_functions_default
  }
});
var small_rules_default = smallRules;
export {
  small_rules_default as default
};
