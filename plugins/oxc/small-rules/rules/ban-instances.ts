// oxlint-disable typescript/no-unnecessary-condition
import { isRecord, isStringArray, isStringRecord } from "@oxlint-utilities/type-utilities";
import { defineRule } from "oxlint-plugin-utilities";

import type { ESTree, Visitor } from "oxlint-plugin-utilities";

interface BannedClassEntry {
	readonly message?: string | undefined;
	readonly originalName: string;
}

function normalizeConfiguration(rawOptions: unknown): ReadonlyMap<string, BannedClassEntry> {
	if (!isRecord(rawOptions) || !("bannedInstances" in rawOptions)) return new Map();

	const { bannedInstances } = rawOptions;
	const bannedClasses = new Map<string, BannedClassEntry>();

	if (isStringArray(bannedInstances)) {
		for (const className of bannedInstances) {
			bannedClasses.set(className.toLowerCase(), { message: undefined, originalName: className });
		}
		return bannedClasses;
	}

	if (isStringRecord(bannedInstances)) {
		for (const [className, message] of Object.entries(bannedInstances)) {
			bannedClasses.set(className.toLowerCase(), { message, originalName: className });
		}
	}

	return bannedClasses;
}

const banInstances = defineRule({
	create(context): Visitor {
		const [rawOptions] = context.options;
		if (rawOptions === undefined || typeof rawOptions !== "object" || rawOptions === null) {
			return {} satisfies Visitor;
		}

		const bannedClasses = normalizeConfiguration(rawOptions);
		if (bannedClasses.size === 0) return {} satisfies Visitor;

		function reportBannedClass(node: ESTree.Node, entry: BannedClassEntry): void {
			if (entry.message !== undefined && entry.message !== "") {
				context.report({
					data: { className: entry.originalName, customMessage: entry.message },
					messageId: "bannedInstanceCustom",
					node,
				});
				return;
			}

			context.report({
				data: { className: entry.originalName },
				messageId: "bannedInstance",
				node,
			});
		}

		return {
			JSXOpeningElement(node): void {
				if (node.name.type !== "JSXIdentifier") return;

				const { name } = node.name;
				const firstCharacter = name.charAt(0);
				if (firstCharacter !== firstCharacter.toLowerCase()) return;

				const entry = bannedClasses.get(name.toLowerCase());
				if (entry !== undefined) reportBannedClass(node, entry);
			},
			NewExpression(node): void {
				if (node.callee.type !== "Identifier" || node.callee.name !== "Instance") return;

				const [firstArgument] = node.arguments;
				if (firstArgument?.type !== "Literal" || typeof firstArgument.value !== "string") {
					return;
				}

				const entry = bannedClasses.get(firstArgument.value.toLowerCase());
				if (entry !== undefined) reportBannedClass(node, entry);
			},
		} satisfies Visitor;
	},
	meta: {
		docs: {
			description: "Ban specified Roblox Instance classes in new Instance() calls and JSX elements.",
		},
		messages: {
			bannedInstance:
				"Instance class '{{className}}' is banned by project configuration. This class may cause performance issues, is deprecated, or has a better alternative. Check project guidelines for the recommended replacement.",
			bannedInstanceCustom: "{{customMessage}}",
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					bannedInstances: {
						description: "Map of banned class names to custom messages, or an array of class names.",
						oneOf: [
							{
								items: { type: "string" },
								type: "array",
							},
							{
								additionalProperties: { type: "string" },
								type: "object",
							},
						],
					},
				},
				type: "object",
			},
		],
		type: "problem",
	},
});

export default banInstances;
