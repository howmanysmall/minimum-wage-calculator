import { argv } from "node:process";
import { defineConfig } from "vitest/config";

const isFocusedRun = argv
	.slice(2)
	.some(
		(argument) => argument.endsWith(".test.ts") || argument.endsWith(".test.tsx") || argument.startsWith("tests/"),
	);

const configuration = defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		coverage: {
			enabled: !isFocusedRun,
			provider: "v8",
			reporter: ["text", "text-summary"],
		},
		projects: ["./vitest.app.config.ts", "./vitest.oxlint.config.ts"],
		reporters: ["dot"],
	},
});

export default configuration;
