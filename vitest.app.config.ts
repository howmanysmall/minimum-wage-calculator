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
	// oxlint-disable-next-line unicorn/no-null
	server: { watch: null },
	test: {
		bail: 1,
		benchmark: {
			exclude: ["**/node_modules/**", "**/dist/**"],
			include: ["tests/benchmarks/**/*.bench.ts"],
		},
		coverage: {
			clean: true,
			cleanOnRerun: false,
			enabled: !isFocusedRun,
			exclude: ["src/**/*.d.ts"],
			include: ["src/**/*.{ts,tsx}"],
			reportOnFailure: false,
			thresholds: {
				branches: 80,
				functions: 95,
				lines: 95,
				statements: 85,
			},
		},
		deps: {
			interopDefault: false,
			optimizer: { ssr: { enabled: false } },
		},
		environment: "node",
		exclude: ["**/node_modules/**", "**/dist/**", "**/.DS_Store", "tests/small-rules/**"],
		fileParallelism: true,
		globals: true,
		include: ["tests/**/*.test.{ts,tsx}"],
		isolate: false,
		maxConcurrency: 64,
		maxWorkers: workerCount,
		name: "app",
		pool: "forks",
		setupFiles: ["./tests/setup/setup-dom.ts"],
		testTimeout: 30_000,
		typecheck: {
			checker: "tsgo",
			enabled: false,
			include: ["tests/**/*.test-d.ts"],
			tsconfig: "./tests/tsconfig.json",
		},
	},
});

export default configuration;
