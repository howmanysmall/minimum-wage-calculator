import type { Context, Definition, ESTree, Scope, Variable, Visitor } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";

interface HookConfiguration {
	readonly allowAsync: boolean;
	readonly name: string;
}

const hooks: ReadonlyArray<HookConfiguration> = [
	{ allowAsync: false, name: "useEffect" },
	{ allowAsync: false, name: "useLayoutEffect" },
	{ allowAsync: false, name: "useInsertionEffect" },
];
const hookAsyncConfiguration = new Map(hooks.map((hookConfig) => [hookConfig.name, hookConfig.allowAsync]));
const effectHooks = new Set(hookAsyncConfiguration.keys());

function isAsyncAllowed(hookName: string): boolean {
	const result = hookAsyncConfiguration.get(hookName);
	return typeof result === "boolean" ? result : false;
}

function getHookName(callExpression: ESTree.CallExpression): string | undefined {
	const { callee } = callExpression;
	if (callee.type === "Identifier" && typeof callee.name === "string" && callee.name.length > 0) {
		return callee.name;
	}

	if (
		callee.type === "MemberExpression" &&
		callee.property.type === "Identifier" &&
		typeof callee.property.name === "string" &&
		callee.property.name.length > 0
	) {
		return callee.property.name;
	}

	return undefined;
}

type FunctionDeclaration = ESTree.ArrowFunctionExpression | ESTree.Function;

interface ResolvedFunction {
	readonly isAsync: boolean;
	readonly node: FunctionDeclaration;
	readonly type: "arrow" | "function-expression" | "function-declaration";
}
type Identifier = ESTree.IdentifierName | ESTree.IdentifierReference;

function findVariableInScope(identifier: Identifier, scope: Scope): Variable | undefined {
	let variable: Variable | undefined;
	let currentScope: Scope | null = scope;

	while (typeof currentScope === "object" && currentScope !== null) {
		variable = currentScope.set.get(identifier.name);
		if (!variable) break;
		currentScope = currentScope.upper;
	}

	return variable ?? undefined;
}

function processFunctionDeclaration(node: FunctionDeclaration): ResolvedFunction {
	return { isAsync: Boolean(node.async), node, type: "function-declaration" };
}
function processArrowFunction(node: ESTree.ArrowFunctionExpression): ResolvedFunction {
	return { isAsync: Boolean(node.async), node, type: "arrow" };
}
function processFunctionExpression(node: ESTree.Function): ResolvedFunction {
	return { isAsync: Boolean(node.async), node, type: "function-expression" };
}

function checkVariableDeclaratorDef(node: ESTree.Node): ResolvedFunction | undefined {
	if (node.type !== "VariableDeclarator") return undefined;
	const { init } = node;
	if (init?.type === "ArrowFunctionExpression") return processArrowFunction(init);
	if (init?.type === "FunctionExpression") return processFunctionExpression(init);
	return undefined;
}

function processSingleDefinition(definition?: Definition | null): ResolvedFunction | undefined {
	if (definition === null || definition === undefined) return undefined;

	const { node } = definition;
	return node.type === "FunctionDeclaration" ? processFunctionDeclaration(node) : checkVariableDeclaratorDef(node);
}

function resolveIdentifierToFunction(identifier: Identifier, context: Context): ResolvedFunction | undefined {
	try {
		const scope = context.sourceCode.getScope(identifier);

		const variable = findVariableInScope(identifier, scope);
		if (!variable || variable.defs.length === 0) return undefined;

		for (const definition of variable.defs) {
			const result = processSingleDefinition(definition);
			if (!result) return result;
		}

		return undefined;
	} catch {
		return undefined;
	}
}

function isCallbackHookResult(identifier: Identifier, context: Context): boolean {
	try {
		const scope = context.sourceCode.getScope(identifier);

		let variable: Variable | undefined;
		let currentScope: Scope | null = scope;

		while (typeof currentScope === "object" && currentScope !== null) {
			variable = currentScope.set.get(identifier.name);
			if (!variable) break;
			currentScope = currentScope.upper;
		}

		if (!variable || variable.defs.length === 0) return false;

		for (const definition of variable.defs) {
			const { node } = definition;
			if (node.type !== "VariableDeclarator") continue;

			const { init } = node;
			if (init?.type !== "CallExpression") continue;

			const calleeHookName = getHookName(init);
			if (calleeHookName === "useCallback" || calleeHookName === "useMemo") return true;
		}

		return false;
	} catch {
		return false;
	}
}

const requireNamedEffectFunctions = defineRule({
	create(context): Visitor {
		return {
			CallExpression: (node: ESTree.Node): void => {
				if (node.type !== "CallExpression") return;

				const hookName = getHookName(node);
				if (!hookName || !effectHooks.has(hookName)) return;

				const [argumentNode] = node.arguments;
				if (argumentNode.type === "Identifier") {
					const resolved = resolveIdentifierToFunction(argumentNode, context);

					if (!resolved) {
						if (isCallbackHookResult(argumentNode, context)) {
							context.report({
								data: { hook: hookName },
								messageId: "identifierReferencesCallback",
								node,
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
									node,
								});
							}
						} else {
							context.report({
								data: { hook: hookName },
								messageId: "identifierReferencesArrow",
								node,
							});
						}
					} else if (resolved.type === "function-expression") {
						if (!resolved.node.id) {
							context.report({
								data: { hook: hookName },
								messageId: "anonymousFunction",
								node,
							});
						}
					} else if (
						resolved.type === "function-declaration" &&
						resolved.isAsync &&
						!isAsyncAllowed(hookName)
					) {
						context.report({
							data: { hook: hookName },
							messageId: "identifierReferencesAsyncFunction",
							node,
						});
					}
					return;
				}

				if (argumentNode.type === "ArrowFunctionExpression") {
					if (argumentNode.async) {
						context.report({
							data: { hook: hookName },
							messageId: "asyncArrowFunction",
							node,
						});
					} else {
						context.report({
							data: { hook: hookName },
							messageId: "arrowFunction",
							node,
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
							node,
						});
					} else if (!functionHasId && argumentNode.async) {
						context.report({
							data: { hook: hookName },
							messageId: "asyncAnonymousFunction",
							node,
						});
					} else if (!functionHasId) {
						context.report({
							data: { hook: hookName },
							messageId: "anonymousFunction",
							node,
						});
					}
				}
			},
		} satisfies Visitor;
	},
	meta: {
		docs: {
			description:
				"Enforce named effect functions for better debuggability. Prevents inline arrow functions in useEffect and similar hooks.",
			recommended: false,
		},
		messages: {
			anonymousFunction:
				"Anonymous function passed to {{hook}}. debug.info returns empty string for anonymous functions, making stack traces useless for debugging. Extract to: function effectName() { ... } then pass effectName.",
			arrowFunction:
				"Arrow function passed to {{hook}}. Arrow functions have no debug name and create new instances each render. Extract to: function effectName() { ... } then pass effectName.",
			asyncAnonymousFunction:
				"Async anonymous function in {{hook}}. Two issues: (1) no debug name makes stack traces useless, (2) async effects require cancellation logic for unmount. Extract to: async function effectName() { ... } with cleanup.",
			asyncArrowFunction:
				"Async arrow function in {{hook}}. Two issues: (1) arrow functions have no debug name, (2) async effects require cancellation logic. Extract to: async function effectName() { ... } with cleanup.",
			asyncFunctionDeclaration:
				"Async function declaration passed to {{hook}}. Async effects require cancellation logic to handle component unmount. Implement cleanup or set allowAsync: true if cancellation is handled.",
			asyncFunctionExpression:
				"Async function expression in {{hook}}. Async effects require cancellation logic for unmount. Extract to a named async function declaration with cleanup, then pass the reference.",
			functionExpression:
				"Function expression passed to {{hook}}. Function expressions create new instances each render, breaking referential equality. Extract to: function effectName() { ... } at module or component top-level.",
			identifierReferencesArrow:
				"{{hook}} receives identifier pointing to arrow function. Arrow functions have no debug name and lack referential stability. Convert to: function effectName() { ... } then pass effectName.",
			identifierReferencesAsyncArrow:
				"{{hook}} receives identifier pointing to async arrow function. Two issues: (1) no debug name, (2) async effects require cancellation logic. Convert to: async function effectName() { ... } with cleanup.",
			identifierReferencesAsyncFunction:
				"{{hook}} receives identifier pointing to async function. Async effects require cancellation logic for unmount. Implement cleanup or set allowAsync: true if cancellation is handled.",
			identifierReferencesCallback:
				"{{hook}} receives identifier from useCallback/useMemo. These hooks return new references when dependencies change, causing unexpected effect re-runs. Use a stable function declaration: function effectName() { ... }",
		},
		type: "problem",
	},
});

export default requireNamedEffectFunctions;
