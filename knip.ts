import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["index.html", "commitlint.config.ts"],
	ignore: ["do-not-sync-ever/**", "plugins/oxc/**", "scripts/**"],
	ignoreDependencies: ["exceljs", "pretty-bytes", "type-fest", "@jsr/cliffy__command"],
	include: ["exports", "types", "nsExports", "nsTypes", "enumMembers", "classMembers"],
	project: ["src/**/*.{ts,tsx}"],
};

// oxlint-disable-next-line import/no-default-export
export default config;
