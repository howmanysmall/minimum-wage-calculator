import { definePlugin } from "@oxlint/plugins";
import requireNamedEffectFunctions from "./require-named-effect-functions";

const smallRules = definePlugin({
	meta: {
		name: "small-rules",
	},
	rules: {
		"require-named-effect-functions": requireNamedEffectFunctions,
	},
});

export default smallRules;
