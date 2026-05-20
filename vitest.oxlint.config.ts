import { availableParallelism } from "node:os";
import { argv } from "node:process";
import { defineConfig } from "vitest/config";

const isFocusedRun = argv
	.slice(2)
	.some(
		(argument) => argument.endsWith(".test.ts") || argument.endsWith(".test.tsx") || argument.startsWith("tests/"),
	);

const cpuCount = availableParallelism();
const workerCount = Math.max(2, Math.min(cpuCount - 1, 12));

const configuration = defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		bail: 1,
		benchmark: {
			include: ["tests/**/*.bench.{ts,tsx}"],
		},
		coverage: {
			clean: true,
			cleanOnRerun: false,
			enabled: !isFocusedRun,
			exclude: [
				"dist",
				"node_modules",
				"scripts",
				"tests",
				"**/*.d.ts",
				"**/.DS_Store",
				"**/*.md",
				"src/**",
				"plugins/oxc/small-rules/utilities/**",
				"plugins/oxc/small-rules/types/missing-types.ts",
			],
			include: ["plugins/oxc/small-rules/**"],
			reportOnFailure: false,
			thresholds: {
				branches: 80,
				functions: 85,
				lines: 85,
				statements: 85,
			},
		},
		deps: {
			interopDefault: false,
			optimizer: { ssr: { enabled: false } },
		},
		environment: "node",
		exclude: ["**/node_modules/**", "**/dist/**", "**/.DS_Store"],
		fileParallelism: true,
		globals: true,
		include: ["tests/small-rules/**/*.test.{ts,tsx}"],
		isolate: false,
		maxConcurrency: 64,
		maxWorkers: workerCount,
		name: "oxlint-rules",
		pool: "forks",
		testTimeout: 1000,
		typecheck: {
			checker: "tsgo",
			enabled: true,
			include: ["tests/**/*.test-d.{ts,tsx}"],
			tsconfig: "./tsconfig.vitest.json",
		},
	},
});

export default configuration;
