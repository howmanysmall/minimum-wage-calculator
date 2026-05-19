import { getVariableByName } from "@oxlint-utilities/ast-utilities";
import { isHoistableJSXElementName } from "@oxlint-utilities/component-utilities";
import {
	getModuleConstInitializer,
	isExplicitUndefinedExpression,
	isModuleLevelScope,
	isStaticExpression,
} from "@oxlint-utilities/static-expression-utilities";
import { isRecord, isStringArray } from "@oxlint-utilities/type-utilities";
import { defineRule } from "oxlint-plugin-utilities";

import type { StaticExpressionOptions } from "@oxlint-utilities/static-expression-utilities";
import type { ESTree, InferContextFromRule, Visitor } from "oxlint-plugin-utilities";

const DEFAULT_WEB_STATIC_GLOBAL_FACTORIES = new Set<string>();

type StaticJsxNode = ESTree.JSXElement | ESTree.JSXFragment;

function normalizeAdditionalHoistableComponents(rawOptions: unknown): ReadonlySet<string> {
	if (!isRecord(rawOptions) || !("additionalHoistableComponents" in rawOptions)) return new Set();

	const { additionalHoistableComponents } = rawOptions;
	if (additionalHoistableComponents === undefined || !isStringArray(additionalHoistableComponents)) {
		return new Set();
	}

	return new Set(additionalHoistableComponents);
}

function normalizeAdditionalStaticFactories(rawOptions: unknown): ReadonlySet<string> {
	if (!isRecord(rawOptions) || !("additionalStaticFactories" in rawOptions)) return new Set();

	const { additionalStaticFactories } = rawOptions;
	if (additionalStaticFactories === undefined || !isStringArray(additionalStaticFactories)) {
		return new Set();
	}

	return new Set(additionalStaticFactories);
}

function isJsxNodeAssignedToModuleConst(context: Context, node: StaticJsxNode): boolean {
	const { parent } = node;
	if (parent.type !== "VariableDeclarator" || parent.id.type !== "Identifier" || parent.init !== node) {
		return false;
	}

	const variable = getVariableByName(context.sourceCode.getScope(node), parent.id.name);
	return variable === undefined ? false : isModuleLevelScope(variable.scope);
}

function isStaticAttributeValue(
	context: Context,
	attribute: ESTree.JSXAttribute,
	seen: Set<ESTree.Node>,
	staticOptions: StaticExpressionOptions,
): boolean {
	const { value } = attribute;
	if (value === null || value.type === "Literal") return true;
	if (
		value.type !== "JSXExpressionContainer" ||
		value.expression.type === "JSXEmptyExpression" ||
		isExplicitUndefinedExpression(context.sourceCode, value.expression, new Set())
	) {
		return false;
	}

	return isStaticExpression(context.sourceCode, value.expression, seen, staticOptions);
}

function hasStaticAttributes(
	context: Context,
	node: ESTree.JSXOpeningElement,
	seen: Set<ESTree.Node>,
	staticOptions: StaticExpressionOptions,
): boolean {
	for (const attribute of node.attributes) {
		if (
			attribute.type === "JSXSpreadAttribute" ||
			!isStaticAttributeValue(context, attribute, seen, staticOptions)
		) {
			return false;
		}
	}

	return true;
}

function hasStaticChildren(
	context: Context,
	children: ReadonlyArray<ESTree.JSXChild>,
	seen: Set<ESTree.Node>,
	additionalComponents: ReadonlySet<string>,
	staticOptions: StaticExpressionOptions,
): boolean {
	for (const child of children) {
		if (!isStaticJsxChild(context, child, seen, additionalComponents, staticOptions)) return false;
	}

	return true;
}

function isStaticJsxFragment(
	context: Context,
	node: ESTree.JSXFragment,
	seen: Set<ESTree.Node>,
	additionalComponents: ReadonlySet<string>,
	staticOptions: StaticExpressionOptions,
): boolean {
	return hasStaticChildren(context, node.children, seen, additionalComponents, staticOptions);
}

function isStaticJsxElement(
	context: Context,
	node: ESTree.JSXElement,
	seen: Set<ESTree.Node>,
	additionalComponents: ReadonlySet<string>,
	staticOptions: StaticExpressionOptions,
): boolean {
	return (
		isHoistableJSXElementName(node.openingElement.name, additionalComponents) &&
		hasStaticAttributes(context, node.openingElement, seen, staticOptions) &&
		hasStaticChildren(context, node.children, seen, additionalComponents, staticOptions)
	);
}

function isStaticJsxNode(
	context: Context,
	node: StaticJsxNode,
	seen: Set<ESTree.Node>,
	additionalComponents: ReadonlySet<string>,
	staticOptions: StaticExpressionOptions,
): boolean {
	if (node.type === "JSXElement") return isStaticJsxElement(context, node, seen, additionalComponents, staticOptions);
	return isStaticJsxFragment(context, node, seen, additionalComponents, staticOptions);
}

function isStaticJsxChild(
	context: Context,
	child: ESTree.JSXChild,
	seen: Set<ESTree.Node>,
	additionalComponents: ReadonlySet<string>,
	staticOptions: StaticExpressionOptions,
): boolean {
	if (child.type === "JSXText") return child.value.trim() === "";
	if (child.type === "JSXElement" || child.type === "JSXFragment") {
		return isStaticJsxNode(context, child, seen, additionalComponents, staticOptions);
	}
	if (child.type !== "JSXExpressionContainer") return false;
	if (child.expression.type === "JSXEmptyExpression") return true;

	if (child.expression.type === "Identifier") {
		const initializer = getModuleConstInitializer(context.sourceCode, child.expression);
		if (initializer?.type === "JSXElement" || initializer?.type === "JSXFragment") {
			return isStaticJsxNode(context, initializer, seen, additionalComponents, staticOptions);
		}
	}

	return isStaticExpression(context.sourceCode, child.expression, seen, staticOptions);
}

function hasStaticJsxAncestor(
	context: Context,
	node: StaticJsxNode,
	additionalComponents: ReadonlySet<string>,
	staticOptions: StaticExpressionOptions,
): boolean {
	let { parent } = node;
	while (parent.type !== "Program") {
		if (
			(parent.type === "JSXElement" || parent.type === "JSXFragment") &&
			isStaticJsxNode(context, parent, new Set(), additionalComponents, staticOptions)
		) {
			return true;
		}
		({ parent } = parent);
	}

	return false;
}

function isInsideHoistedJsxNode(context: Context, node: StaticJsxNode): boolean {
	let current: ESTree.Node = node;
	let { parent } = current;
	while (parent.type !== "Program") {
		if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier" && parent.init === current) {
			const variable = getVariableByName(context.sourceCode.getScope(current), parent.id.name);
			if (variable !== undefined && isModuleLevelScope(variable.scope)) return true;
		}
		if (parent.type === "JSXElement" || parent.type === "JSXFragment") current = parent;
		({ parent } = parent);
	}
	return false;
}

function reportHoistableJsxNode(context: Context, node: StaticJsxNode): void {
	const elementText = context.sourceCode.getText(node);
	context.report({
		data: { elementText },
		messageId: "hoistableJsxElement",
		node,
	});
}

const preferHoistedJsxElements = defineRule({
	create(context): Visitor {
		const [rawOptions] = context.options;
		const additionalComponents = normalizeAdditionalHoistableComponents(rawOptions);
		const additionalStaticFactories = normalizeAdditionalStaticFactories(rawOptions);

		const staticOptions: StaticExpressionOptions = {
			staticGlobalFactories: new Set([...DEFAULT_WEB_STATIC_GLOBAL_FACTORIES, ...additionalStaticFactories]),
		};

		return {
			JSXElement(node): void {
				if (!isStaticJsxElement(context, node, new Set(), additionalComponents, staticOptions)) return;
				if (isJsxNodeAssignedToModuleConst(context, node)) return;
				if (hasStaticJsxAncestor(context, node, additionalComponents, staticOptions)) return;
				if (isInsideHoistedJsxNode(context, node)) return;

				reportHoistableJsxNode(context, node);
			},
			JSXFragment(node): void {
				if (!isStaticJsxFragment(context, node, new Set(), additionalComponents, staticOptions)) return;
				if (isJsxNodeAssignedToModuleConst(context, node)) return;
				if (hasStaticJsxAncestor(context, node, additionalComponents, staticOptions)) return;
				if (isInsideHoistedJsxNode(context, node)) return;

				reportHoistableJsxNode(context, node);
			},
		} satisfies Visitor;
	},
	meta: {
		docs: {
			description: "Prefer extracting static React JSX elements and fragments to module-level constants.",
		},
		messages: {
			hoistableJsxElement:
				"Extract `{{elementText}}` to a shared module-level const — this React JSX node is fully static and identical nodes should reuse the same const.",
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					additionalHoistableComponents: {
						description: "Additional component names that can be hoisted to module-level constants.",
						items: { type: "string" },
						type: "array",
					},
					additionalStaticFactories: {
						description:
							"Additional factory functions whose return values are considered static (e.g. createSpriteToken).",
						items: { type: "string" },
						type: "array",
					},
				},
				type: "object",
			},
		],
		type: "suggestion",
	},
});
type Context = InferContextFromRule<typeof preferHoistedJsxElements>;

export default preferHoistedJsxElements;
