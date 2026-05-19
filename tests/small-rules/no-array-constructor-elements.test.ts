import { describe } from "vitest";
import rule from "@oxlint-rules/no-array-constructor-elements";

import { tsx } from "./rule-testers";

describe("no-array-constructor-elements", () => {
	// @ts-expect-error -- Shut up.
	tsx.run("no-array-constructor-elements", rule, {
		invalid: [
			{
				code: 'const values = new Array("a", "b");',
				errors: [{ messageId: "avoidConstructorEnumeration" }],
				options: [{ environment: "roblox-ts" }],
				output: 'const values = ["a", "b"];',
			},
			{
				code: 'const values = new Array<string>("a", "b");',
				errors: [{ messageId: "avoidConstructorEnumeration" }],
				options: [{ environment: "roblox-ts" }],
				output: 'const values = ["a", "b"];',
			},
			{
				code: 'const value = new Array("a");',
				errors: [{ messageId: "avoidSingleArgumentConstructor" }],
				options: [{ environment: "roblox-ts" }],
				output: 'const value = ["a"];',
			},
			{
				code: "const value = new Array(size);",
				errors: [
					{
						messageId: "avoidLengthConstructorInStandard",
						suggestions: [
							{
								messageId: "suggestArrayFromLength",
								output: "const value = Array.from({ length: size });",
							},
						],
					},
				],
				options: [{ environment: "standard" }],
				output: null,
			},
			{
				code: "const value = new Array(3);",
				errors: [
					{
						messageId: "avoidLengthConstructorInStandard",
						suggestions: [
							{
								messageId: "suggestArrayFromLength",
								output: "const value = Array.from({ length: 3 });",
							},
						],
					},
				],
				options: [{ environment: "standard" }],
				output: null,
			},
			{
				code: "const value = new Array(256, -1);",
				errors: [
					{
						messageId: "avoidConstructorEnumeration",
					},
				],
				options: [{ environment: "standard" }],
				output: "const value = [256, -1];",
			},
			{
				code: "const value = new Array();",
				errors: [{ messageId: "requireExplicitGenericOnNewArray" }],
				options: [{ environment: "roblox-ts" }],
				output: null,
			},
			// Push with spread in collapse → suggestion (not auto-fix)
			{
				code: `
const array = new Array<string>();
array.push(...values);
array.push("b");
`,
				errors: [
					{
						messageId: "collapseArrayPushInitialization",
						suggestions: [
							{
								messageId: "suggestCollapseArrayPushInitialization",
								output: `
const array = [...values, "b"];
`,
							},
						],
					},
				],
				options: [{ environment: "roblox-ts" }],
				output: null,
			},
			// new Array with spread element in args → suggestion
			{
				code: 'const values = new Array(...items, "x");',
				errors: [
					{
						messageId: "avoidConstructorEnumeration",
						suggestions: [
							{
								messageId: "suggestArrayLiteral",
								output: 'const values = [...items, "x"];',
							},
						],
					},
				],
				options: [{ environment: "roblox-ts" }],
				output: null,
			},
			// new Array with single spread argument → suggestion
			{
				code: "const arr = new Array(...items);",
				errors: [
					{
						messageId: "avoidSingleArgumentConstructor",
						suggestions: [
							{
								messageId: "suggestArrayLiteral",
								output: "const arr = [...items];",
							},
						],
					},
				],
				options: [{ environment: "roblox-ts" }],
				output: null,
			},
			// Collapse inside a BlockStatement → exercises BlockStatement visitor
			{
				code: `
{
    const array = new Array<string>();
    array.push("a");
    array.push("b");
}
`,
				errors: [{ messageId: "collapseArrayPushInitialization" }],
				options: [{ environment: "roblox-ts" }],
				output: `
{
    const array = ["a", "b"];
}
`,
			},
			{
				code: `
const array = new Array<string>();
array.push("a");
array.push("b");
array.push("c", "d", "e", "f");
`,
				errors: [{ messageId: "collapseArrayPushInitialization" }],
				options: [{ environment: "roblox-ts" }],
				output: `
const array = ["a", "b", "c", "d", "e", "f"];
`,
			},
			{
				code: `
const array = new Array<string>();
array.push(getValue());
array.push("b");
`,
				errors: [
					{
						messageId: "collapseArrayPushInitialization",
						suggestions: [
							{
								messageId: "suggestCollapseArrayPushInitialization",
								output: `
const array = [getValue(), "b"];
`,
							},
						],
					},
				],
				options: [{ environment: "roblox-ts" }],
				output: null,
			},
			{
				code: "const value = new Array({ one: 1 });",
				errors: [{ messageId: "avoidSingleArgumentConstructor" }],
				options: [{ environment: "roblox-ts" }],
				output: "const value = [{ one: 1 }];",
			},
			{
				code: "const value = new Array(() => 1);",
				errors: [{ messageId: "avoidSingleArgumentConstructor" }],
				options: [{ environment: "roblox-ts" }],
				output: "const value = [() => 1];",
			},
			{
				code: "const value = new Array(`static`);",
				errors: [{ messageId: "avoidSingleArgumentConstructor" }],
				options: [{ environment: "roblox-ts" }],
				output: "const value = [`static`];",
			},
			{
				code: "const value = new Array(void something);",
				errors: [{ messageId: "avoidSingleArgumentConstructor" }],
				options: [{ environment: "roblox-ts" }],
				output: "const value = [void something];",
			},
			{
				code: 'const values = new Array("a", getValue());',
				errors: [{ messageId: "avoidConstructorEnumeration" }],
				options: [{ environment: "roblox-ts" }],
				output: 'const values = ["a", getValue()];',
			},
			{
				code: `
const array = new Array<unknown>();
array.push(value.member);
array.push(this.value);
array.push(value[key]);
array.push(flag ? "a" : "b");
array.push(\`x\${value}\`);
array.push([value]);
array.push({ [key]: value });
array.push((first, second));
`,
				errors: [{ messageId: "collapseArrayPushInitialization" }],
				options: [{ environment: "roblox-ts" }],
				output: `
const array = [value.member, this.value, value[key], flag ? "a" : "b", \`x\${value}\`, [value], { [key]: value }, first, second];
`,
			},
			{
				code: `
const array = new Array<boolean>();
array.push(delete value.key);
`,
				errors: [
					{
						messageId: "collapseArrayPushInitialization",
						suggestions: [
							{
								messageId: "suggestCollapseArrayPushInitialization",
								output: `
const array = [delete value.key];
`,
							},
						],
					},
				],
				options: [{ environment: "roblox-ts" }],
				output: null,
			},
		],
		valid: [
			"const value = new Array<string>();",
			"const value: Array<string> = new Array();",
			{
				code: "const value = new Array() as Array<string>;",
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: "function getValue(value: Array<string> = new Array()) { return value; }",
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: "class Store { values: Array<string> = new Array(); }",
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: "const sized = new Array<string>(size);",
				options: [{ environment: "standard" }],
			},
			{
				code: "const sized = new Array(10);",
				options: [{ environment: "roblox-ts" }],
			},

			{
				code: `
type ColorSequenceKeypoint = { time: number };
declare const length: number;
const keypoints = new Array<ColorSequenceKeypoint>(length);
`,
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
type ColorSequenceKeypoint = { time: number };
const keypoints = new Array<ColorSequenceKeypoint>(256, -1);
`,
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
function multiplyByTwo(array: ReadonlyArray<number>): ReadonlyArray<number> {
    const newArray = new Array<number>(array.size());
    let size = 0;

    for (const value of array) newArray[size++] = value * 2;
    return newArray;
}
`,
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: "const value = new Array();",
				options: [{ environment: "roblox-ts", requireExplicitGenericOnNewArray: false }],
			},
			{
				code: `
class Array<TValue> {
    constructor(..._arguments: Array<TValue>) {}
}
const value = new Array("a");
`,
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
const array = new Array<string>();
array.push("a");
doSomething(array);
array.push("b");
`,
				options: [{ environment: "roblox-ts" }],
			},

			// ReadonlyArray binding prevents collapse
			{
				code: `
const arr: ReadonlyArray<string> = new Array();
arr.push("a");
arr.push("b");
`,
				options: [{ environment: "roblox-ts" }],
			},

			// Zero-argument push stops scanning
			{
				code: `
const arr = new Array<string>();
arr.push();
arr.push("a");
`,
				options: [{ environment: "roblox-ts" }],
			},

			// Non-push expression stops scanning
			{
				code: `
const arr = new Array<string>();
doSomething();
arr.push("a");
`,
				options: [{ environment: "roblox-ts" }],
			},
		],
	});
});
