import type { KnipConfig } from "knip";

const configuration: KnipConfig = {
	entry: ["index.html", "commitlint.config.ts"],
	ignore: ["do-not-sync-ever/**", "plugins/oxc/**", "scripts/**"],
	ignoreDependencies: ["exceljs", "pretty-bytes", "type-fest"],
	include: ["exports", "types", "nsExports", "nsTypes", "enumMembers"],
	project: ["src/**/*.{ts,tsx}"],
};

export default configuration;
