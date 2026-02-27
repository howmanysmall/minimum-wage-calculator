#!/usr/bin/env bun

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { buildHudSnapshotAsync } from "./build-hud-snapshot";
import { buildUsdaSnapshotAsync } from "./build-usda-snapshot";

const ROOT_DIR = resolve(dirname(import.meta.path), "..");
const HUD_YEAR = 2026;
const HUD_URL = "https://www.huduser.gov/portal/datasets/fmr/fmr2026/fy2026_safmrs.xlsx";
const USDA_URL = "https://www.fns.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports";
const TMP_DIR = "/tmp";
const HUD_XLSX_PATH = join(TMP_DIR, "fy2026_safmrs.xlsx");
const RENT_SNAPSHOT_PATH = join(ROOT_DIR, "src", "data", "zip_rent_safmr_2026.json");
const FOOD_SNAPSHOT_PATH = join(ROOT_DIR, "src", "data", "food_usda_2026_01.json");
const VERSION_PATH = join(ROOT_DIR, "src", "data", "version.json");

console.log("Downloading HUD SAFMR workbook...");

const result = await fetch(HUD_URL);
if (!result.ok) throw new Error(`Download failed: ${result.status}`);

await mkdir(TMP_DIR, { recursive: true });
await writeFile(HUD_XLSX_PATH, new Uint8Array(await result.arrayBuffer()));

console.log("Building ZIP rent snapshot JSON...");
await buildHudSnapshotAsync(HUD_XLSX_PATH, RENT_SNAPSHOT_PATH, HUD_YEAR, HUD_URL);

console.log("Building USDA food snapshot JSON...");
await buildUsdaSnapshotAsync(FOOD_SNAPSHOT_PATH, USDA_URL);

const versionPayload = {
	appBuiltAt: new Date().toISOString().slice(0, 10),
	foodAsOf: "USDA Food Plans latest monthly report snapshot",
	rentAsOf: `HUD SAFMR FY ${HUD_YEAR} (2BR)`,
};
await writeFile(VERSION_PATH, `${JSON.stringify(versionPayload, undefined, 2)}\n`, "utf8");

console.log("Done. Snapshots and src/data/version.json were updated.");
