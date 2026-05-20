import { describe } from "vitest";
import rule from "@oxlint-rules/prefer-ternary-conditional-rendering";

import { jsx } from "./rule-testers";

describe("prefer-ternary-conditional-rendering", () => {
	// @ts-expect-error - This is dumb
	jsx.run("prefer-ternary-conditional-rendering", rule, {
		invalid: [
			{
				code: `
function Component({ gradient, gradientToUse, rarityStyle }) {
    return <>{gradient !== undefined && <uigradient key="ui-gradient" Color={gradient} />}{gradient === undefined && <AnimatedGradient key="animated-gradient" colorValue={gradientToUse} rotation={45} sweepingSpeed={rarityStyle?.sweepingSpeed ?? 0} />}</>;
}
`,
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: `
function Component({ gradient, gradientToUse, rarityStyle }) {
    return <>{gradient !== undefined ? <uigradient key="ui-gradient" Color={gradient} /> : <AnimatedGradient key="animated-gradient" colorValue={gradientToUse} rotation={45} sweepingSpeed={rarityStyle?.sweepingSpeed ?? 0} />}</>;
}
`,
			},
			{
				code: "function Component({ flag }) { return <>{flag && <A />}{!flag && <B />}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: "function Component({ flag }) { return <>{flag ? <A /> : <B />}</>; }",
			},
			{
				code: 'function Component({ mode }) { return <>{mode === "x" && <A />}{mode !== "x" && <B />}</>; }',
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: 'function Component({ mode }) { return <>{mode === "x" ? <A /> : <B />}</>; }',
			},
			{
				code: 'function Component({ mode }) { return <>{mode === "x" && <A />}{"x" !== mode && <B />}</>; }',
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: 'function Component({ mode }) { return <>{mode === "x" ? <A /> : <B />}</>; }',
			},
			{
				code: "function Component() { return <>{isReady() && <A />}{!isReady() && <B />}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: null,
			},
			{
				code: "function Component({ mode }) { return <>{mode === getMode() && <A />}{mode !== getMode() && <B />}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: null,
			},
			{
				code: "function Component({ state }) { return <>{state.value === 1 && <A />}{state.value !== 1 && <B />}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: null,
			},
			{
				code: "function Component() { return <>{this.ready && <A />}{!this.ready && <B />}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: null,
			},
			{
				code: "function Component({ flag }) { return <section>{flag && <A />}{!flag && <B />}</section>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: "function Component({ flag }) { return <section>{flag ? <A /> : <B />}</section>; }",
			},
			{
				code: "function Component({ flag }) { return <>{!flag && <A />}{flag && <B />}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: "function Component({ flag }) { return <>{!flag ? <A /> : <B />}</>; }",
			},
			{
				code: "function Component({ flag }) { return <>{flag && <>A</>}{!flag && <>B</>}</>; }",
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: "function Component({ flag }) { return <>{flag ? <>A</> : <>B</>}</>; }",
			},
			{
				code: 'function Component({ mode }) { return <>{mode !== "x" && <A />}{mode === "x" && <B />}</>; }',
				errors: [{ messageId: "preferTernaryConditionalRendering" }],
				output: 'function Component({ mode }) { return <>{mode !== "x" ? <A /> : <B />}</>; }',
			},
		],
		valid: [
			"function Component({ flag }) { return <>{flag ? <A /> : <B />}</>; }",
			"function Component({ first, second }) { return <>{first && <A />}{second && <B />}</>; }",
			"function Component({ flag }) { return <>{flag && doThing()}{!flag && <B />}</>; }",
			"function Component({ flag }) { return <>{flag && <A />}</>; }",
			'function Component({ mode }) { return <>{mode === "x" && <A />}text{mode !== "x" && <B />}</>; }',
			"function Component({ flag }) { return <>{flag && <A />}<Spacer />{!flag && <B />}</>; }",
			"function Component({ flag }) { return <>{flag || <A />}{!flag && <B />}</>; }",
			"function Component({ flag }) { return <>{flag && value}{!flag && <B />}</>; }",
			"function Component({ flag }) { return <>{flag && <A />}{!other && <B />}</>; }",
			"function Component({ flag }) { return <>{flag && <A />}{!flag}</>; }",
			"function Component({ flag }) { return <>{flag && <A />}{/* empty */}{!flag && <B />}</>; }",
		],
	});
});
