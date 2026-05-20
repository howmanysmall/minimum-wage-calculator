#!/usr/bin/env jiti

import { resolve } from "node:path";
import { argv } from "node:process";
import { Command } from "@cliffy/command";
import { write } from "@scripts-polyfills/bun-write";
import { Workbook } from "exceljs";

import type { Cell, Worksheet } from "exceljs";

interface HudRecord {
	readonly hudAreaCode: string;
	readonly hudAreaName: string;
	readonly sourceYear: number;
	readonly twoBedroom: number;
	readonly zip: string;
}

interface HudSnapshot {
	readonly generatedAt: string;
	readonly recordCount: number;
	readonly records: ReadonlyArray<HudRecord>;
	readonly sourceUrl: string;
	readonly sourceYear: number;
}

const ZIP_PATTERN = /^\d{5}$/u;

function getCellText(cell: Cell): string {
	const cellValue = cell.value;
	if (cellValue === undefined || cellValue === null) return "";
	if (typeof cellValue === "object" && "richText" in cellValue) {
		return cellValue.richText.map(({ text }) => text).join("");
	}

	// oxlint-disable-next-line typescript/no-base-to-string
	return String(cellValue);
}

function parseTwoBedroom(rawValue: string): number | undefined {
	const parsedValue = Number.parseFloat(rawValue);
	return Number.isFinite(parsedValue) ? Math.round(parsedValue) : undefined;
}

function parseHudRecords(sheet: Worksheet, sourceYear: number): Array<HudRecord> {
	const records = new Array<HudRecord>();
	sheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) return;

		const zip = getCellText(row.getCell(1)).trim();
		if (!ZIP_PATTERN.test(zip)) return;

		const twoBedroom = parseTwoBedroom(getCellText(row.getCell(10)).trim());
		if (twoBedroom === undefined) return;

		records.push({
			hudAreaCode: getCellText(row.getCell(2)).trim(),
			hudAreaName: getCellText(row.getCell(3)).trim(),
			sourceYear,
			twoBedroom,
			zip,
		});
	});

	return records;
}

async function parseHudSafmrAsync(inputXlsxPath: string, sourceYear: number, sourceUrl: string): Promise<HudSnapshot> {
	const workbook = new Workbook();
	await workbook.xlsx.readFile(inputXlsxPath);

	const [sheet] = workbook.worksheets;
	if (sheet === undefined) {
		const error = new Error("No sheets found in HUD workbook.");
		Error.captureStackTrace(error, parseHudSafmrAsync);
		throw error;
	}

	const records = parseHudRecords(sheet, sourceYear);
	return {
		generatedAt: new Date().toISOString(),
		recordCount: records.length,
		records,
		sourceUrl,
		sourceYear,
	};
}

export async function buildHudSnapshotAsync(
	inputPath: string,
	output: string,
	year: number,
	sourceUrl: string,
): Promise<void> {
	const payload = await parseHudSafmrAsync(inputPath, year, sourceUrl);
	await write(output, JSON.stringify(payload), { createPath: true });
	console.log(`Wrote ${payload.recordCount} ZIP rent records -> ${output}`);
}

if (import.meta.main) {
	const command = new Command()
		.name("build-hud-snapshot")
		.version("2.0.0")
		.description("Build ZIP -> 2BR rent snapshot from HUD SAFMR workbook.")
		.option("--input <path:string>", "Path to fyXXXX_safmrs.xlsx", { required: true })
		.option("--output <path:string>", "Output JSON path", { required: true })
		.option("--year <year:integer>", "HUD SAFMR source year", { required: true })
		.option("--source-url <url:string>", "HUD source URL", { required: true })
		.action(async ({ input, output, sourceUrl, year }) => {
			await buildHudSnapshotAsync(input, output, year, sourceUrl);
		});

	const scriptIndex = argv.findIndex((argument) => resolve(argument) === import.meta.filename);
	await command.parse(argv.slice(scriptIndex + 1));
}
