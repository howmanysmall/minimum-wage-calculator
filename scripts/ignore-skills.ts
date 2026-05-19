#!/usr/bin/env jiti
/** Reads skills-lock.json and adds every skill directory under .agents/skills/ to .gitignore (if not already present). */

import { readFileSync, writeFileSync } from "node:fs";
import { type } from "arktype";
import { consola } from "consola";

const GITIGNORE_PATH = ".gitignore";
const SKILLS_DIR = ".agents/skills";

const isLockFile = type({
	skills: "Record<string, unknown>",
	version: "1",
});

const lockfile = isLockFile.assert(JSON.parse(readFileSync("skills-lock.json", "utf8")));

const skillNames = Object.keys(lockfile.skills);
const lines = skillNames.map((name) => `${SKILLS_DIR}/${name}/`);

let gitignore = readFileSync(GITIGNORE_PATH, "utf8");
const existingLines = new Set(gitignore.split("\n").map((line) => line.trim()));

let added = 0;
for (const line of lines) {
	if (!existingLines.has(line)) {
		gitignore += `${line}\n`;
		added += 1;
	}
}

if (added > 0) {
	writeFileSync(GITIGNORE_PATH, gitignore);
	consola.success(`Added ${added} skill(s) to .gitignore`);
} else consola.info("All skills already in .gitignore");
