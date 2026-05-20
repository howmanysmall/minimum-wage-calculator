#!/usr/bin/env jiti

import { resolve } from "node:path";
import { argv } from "node:process";
import { Command } from "@cliffy/command";
import { write } from "@scripts-polyfills/bun-write";

import type { FoodSnapshot } from "../src/types";

type TierName = "low" | "moderate" | "liberal";

interface ThriftyValues {
	readonly adult: number;
	readonly child: number;
}

interface TierValues {
	readonly liberal: number;
	readonly low: number;
	readonly moderate: number;
}

interface ThreeLevelValues {
	readonly adult: TierValues;
	readonly child: TierValues;
}

const MONTH_YEAR_PATTERN = /Cost of Food at Home at Three Levels:\s*U\.S\. Average,\s*([A-Z]+)\s+(\d{4})/iu;
const TABLE_PATTERN = /<table[^>]*>.*?<\/table>/isu;
const ROW_PATTERN = /<tr[^>]*>(.*?)<\/tr>/gisu;
const CELL_PATTERN = /<t[dh][^>]*>(.*?)<\/t[dh]>/gisu;
// oxlint-disable-next-line sonar/slow-regex
const TAG_PATTERN = /<[^>]+>/gu;
const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/gu;
const CURRENCY_CLEAN_PATTERN = /[^0-9.-]/gu;
const DECIMAL_HTML_ENTITY_PATTERN = /&#(\d+);/gu;
const NAMED_HTML_ENTITY_PATTERN = /&[a-z]+;/giu;
const WHITESPACE_PATTERN = /\s+/gu;

const ENTRIES = Object.entries({
	"&#39;": "'",
	"&amp;": "&",
	"&gt;": ">",
	"&lt;": "<",
	"&nbsp;": " ",
	"&quot;": '"',
} as const);

const THRIFTY_HEADING_PREFIX = String.raw`Thrifty Food Plan:\s*`;
const THREE_LEVEL_HEADING_PREFIX = String.raw`Cost of Food at Home at Three Levels:\s*U\.S\. Average,\s*`;

async function fetchTextAsync(url: string): Promise<string> {
	const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
	if (!response.ok) {
		const error = new Error(`HTTP ${response.status} while fetching ${url}`);
		Error.captureStackTrace(error, fetchTextAsync);
		throw error;
	}
	return response.text();
}

function fromCodePoint(_: string, encodedValue: string): string {
	const parsedCodePoint = Number.parseInt(encodedValue, 10);
	if (!Number.isFinite(parsedCodePoint)) return "";

	return String.fromCodePoint(parsedCodePoint);
}

function cleanHtmlText(raw: string): string {
	let text = raw.replaceAll(TAG_PATTERN, "");
	for (const [encodedValue, decodedValue] of ENTRIES) text = text.replaceAll(encodedValue, decodedValue);

	return text
		.replaceAll(DECIMAL_HTML_ENTITY_PATTERN, fromCodePoint)
		.replaceAll(NAMED_HTML_ENTITY_PATTERN, "")
		.replaceAll("\u00A0", " ")
		.replaceAll(WHITESPACE_PATTERN, " ")
		.trim();
}

function parseCurrency(value: string): number {
	const cleaned = value.replaceAll(",", "").replaceAll(CURRENCY_CLEAN_PATTERN, "");
	if (!cleaned) {
		const error = new Error(`Unable to parse currency value: ${JSON.stringify(value)}`);
		Error.captureStackTrace(error, parseCurrency);
		throw error;
	}
	return Number.parseFloat(cleaned);
}

function escapeRegex(value: string): string {
	return value.replaceAll(REGEX_ESCAPE_PATTERN, String.raw`\$&`);
}

function extractTableAfterHeading(pageHtml: string, headingPattern: RegExp): string {
	const headingMatch = headingPattern.exec(pageHtml);
	if (!headingMatch) {
		const error = new Error(`Heading not found for pattern: ${headingPattern.source}`);
		Error.captureStackTrace(error, extractTableAfterHeading);
		throw error;
	}

	const segment = pageHtml.slice(headingMatch.index + headingMatch[0].length);
	const tableMatch = TABLE_PATTERN.exec(segment);
	if (!tableMatch) {
		const error = new Error(`Table not found after heading pattern: ${headingPattern.source}`);
		Error.captureStackTrace(error, extractTableAfterHeading);
		throw error;
	}

	return tableMatch[0];
}

function tableRows(tableHtml: string): Array<Array<string>> {
	const rows = new Array<Array<string>>();
	for (const rowMatch of tableHtml.matchAll(ROW_PATTERN)) {
		const [, rowHtml] = rowMatch;
		if (typeof rowHtml !== "string") continue;

		const cells = new Array<string>();
		for (const cellMatch of rowHtml.matchAll(CELL_PATTERN)) {
			const [, cellHtml] = cellMatch;
			if (typeof cellHtml !== "string") continue;
			cells.push(cleanHtmlText(cellHtml));
		}

		if (cells.length > 0) rows.push(cells);
	}

	return rows;
}

function isSectionLabel(label: string): label is "female" | "male" | "child" {
	return label === "female" || label === "male" || label === "child";
}

function tryParseThriftyAdultValue(label: string, section: string, cells: ReadonlyArray<string>): number | undefined {
	if (label !== "20-50 years") return undefined;
	const rawValue = cells.at(2);
	if (typeof rawValue !== "string") return undefined;
	const parsed = parseCurrency(rawValue);
	if (section === "female" || section === "male") return parsed;
	return undefined;
}

function tryParseThriftyChildValue(label: string, section: string, cells: ReadonlyArray<string>): number | undefined {
	if (label !== "9-11 years" || section !== "child") return undefined;
	const rawValue = cells.at(2);
	if (typeof rawValue !== "string") return undefined;
	return parseCurrency(rawValue);
}

function parseThriftyRows(rows: ReadonlyArray<ReadonlyArray<string>>): ThriftyValues {
	let section = "";
	let femaleAdult: number | undefined;
	let maleAdult: number | undefined;
	let childValue: number | undefined;
	for (const cells of rows) {
		const label = cells[0]?.toLowerCase() ?? "";
		if (isSectionLabel(label)) {
			section = label;
			continue;
		}

		if (cells.length < 3) continue;

		const adultValue = tryParseThriftyAdultValue(label, section, cells);
		if (adultValue !== undefined && section === "female") femaleAdult = adultValue;
		if (adultValue !== undefined && section === "male") maleAdult = adultValue;

		const parsedChild = tryParseThriftyChildValue(label, section, cells);
		if (parsedChild !== undefined) childValue = parsedChild;
	}

	if (femaleAdult === undefined || maleAdult === undefined || childValue === undefined) {
		const error = new Error("Missing required Thrifty table values for 20-50 years and/or 9-11 years.");
		Error.captureStackTrace(error, parseThriftyRows);
		throw error;
	}

	return { adult: Math.round((femaleAdult + maleAdult) / 2), child: Math.round(childValue) };
}

function parseThreeLevelRowValues(cells: ReadonlyArray<string>): TierValues | undefined {
	const lowRawValue = cells.at(2);
	const moderateRawValue = cells.at(4);
	const liberalRawValue = cells.at(6);
	if (
		typeof lowRawValue !== "string" ||
		typeof moderateRawValue !== "string" ||
		typeof liberalRawValue !== "string"
	) {
		return undefined;
	}

	return {
		liberal: parseCurrency(liberalRawValue),
		low: parseCurrency(lowRawValue),
		moderate: parseCurrency(moderateRawValue),
	};
}

function processThreeLevelRow(
	cells: ReadonlyArray<string>,
	section: string,
):
	| { type: "section"; value: string }
	| { type: "femaleAdult"; value: TierValues }
	| { type: "maleAdult"; value: TierValues }
	| { type: "child"; value: TierValues }
	| { type: "skip" } {
	const label = cells[0]?.toLowerCase() ?? "";
	if (isSectionLabel(label)) return { type: "section", value: label };
	if (cells.length < 7) return { type: "skip" };

	const rowValues = parseThreeLevelRowValues(cells);
	if (rowValues === undefined) return { type: "skip" };
	if (label === "20-50 years" && section === "female") return { type: "femaleAdult", value: rowValues };
	if (label === "20-50 years" && section === "male") return { type: "maleAdult", value: rowValues };
	if (label === "9-11 years" && section === "child") return { type: "child", value: rowValues };
	return { type: "skip" };
}

function parseThreeLevelRows(rows: ReadonlyArray<ReadonlyArray<string>>): ThreeLevelValues {
	let section = "";
	let femaleAdult: TierValues | undefined;
	let maleAdult: TierValues | undefined;
	let childValues: TierValues | undefined;
	for (const cells of rows) {
		const result = processThreeLevelRow(cells, section);
		if (result.type === "section") section = result.value;
		if (result.type === "femaleAdult") femaleAdult = result.value;
		if (result.type === "maleAdult") maleAdult = result.value;
		if (result.type === "child") childValues = result.value;
	}

	if (femaleAdult === undefined || maleAdult === undefined || childValues === undefined) {
		const error = new Error("Missing required three-level values for 20-50 years and/or 9-11 years.");
		Error.captureStackTrace(error, parseThreeLevelRows);
		throw error;
	}

	const adult = ["low", "moderate", "liberal"] as const;
	const adultResult: Record<TierName, number> = { liberal: 0, low: 0, moderate: 0 };
	for (const tier of adult) adultResult[tier] = Math.round((femaleAdult[tier] + maleAdult[tier]) / 2);

	const childResult: Record<TierName, number> = { liberal: 0, low: 0, moderate: 0 };
	for (const tier of adult) childResult[tier] = Math.round(childValues[tier]);

	return { adult: adultResult, child: childResult };
}

function createHeadingPattern(prefix: string, month: string, year: number): RegExp {
	return new RegExp(`${prefix}${escapeRegex(month)}\\s+${year}`, "iu");
}

async function parseUsdaFoodSnapshotAsync(sourceUrl: string): Promise<FoodSnapshot> {
	const pageHtml = await fetchTextAsync(sourceUrl);
	const monthYearMatch = MONTH_YEAR_PATTERN.exec(pageHtml);
	if (!monthYearMatch) {
		const error = new Error("Unable to find latest month/year label on USDA page.");
		Error.captureStackTrace(error, parseUsdaFoodSnapshotAsync);
		throw error;
	}

	const [, sourceMonthRaw, sourceYearRaw] = monthYearMatch;
	if (typeof sourceMonthRaw !== "string" || typeof sourceYearRaw !== "string") {
		const error = new TypeError("Unable to parse month/year values from USDA heading.");
		Error.captureStackTrace(error, parseUsdaFoodSnapshotAsync);
		throw error;
	}

	const sourceMonth = sourceMonthRaw;
	const sourceYear = Number.parseInt(sourceYearRaw, 10);
	const thriftyTable = extractTableAfterHeading(
		pageHtml,
		createHeadingPattern(THRIFTY_HEADING_PREFIX, sourceMonth, sourceYear),
	);
	const threeLevelTable = extractTableAfterHeading(
		pageHtml,
		createHeadingPattern(THREE_LEVEL_HEADING_PREFIX, sourceMonth, sourceYear),
	);

	const thrifty = parseThriftyRows(tableRows(thriftyTable));
	const threeLevels = parseThreeLevelRows(tableRows(threeLevelTable));
	const adultPerPerson = {
		liberal: threeLevels.adult.liberal,
		low: threeLevels.adult.low,
		moderate: threeLevels.adult.moderate,
		thrifty: thrifty.adult,
	};
	const childPerPerson = {
		liberal: threeLevels.child.liberal,
		low: threeLevels.child.low,
		moderate: threeLevels.child.moderate,
		thrifty: thrifty.child,
	};

	return {
		adultPerPerson,
		childPerPerson,
		notes: "Derived from USDA latest monthly report tables. Adult values are average of female/male 20-50 years; child values use 9-11 years row.",
		singleAdult: adultPerPerson,
		sourceMonth,
		sourceUrl,
		sourceYear,
	};
}

export async function buildUsdaSnapshotAsync(output: string, sourceUrl: string): Promise<void> {
	const payload = await parseUsdaFoodSnapshotAsync(sourceUrl);
	await write(output, JSON.stringify(payload), { createPath: true });
	console.log(`Wrote USDA food snapshot (${payload.sourceMonth} ${payload.sourceYear}) -> ${output}`);
}

if (import.meta.main) {
	const command = new Command()
		.name("build-usda-snapshot")
		.version("2.0.0")
		.description("Build USDA food snapshot JSON from the USDA monthly report page.")
		.option("--output <path:string>", "Output JSON path", { required: true })
		.option("--source-url <url:string>", "USDA monthly report page URL", { required: true })
		.action(async ({ output, sourceUrl }) => {
			await buildUsdaSnapshotAsync(output, sourceUrl);
		});

	const scriptIndex = argv.findIndex((argument) => resolve(argument) === import.meta.filename);
	await command.parse(argv.slice(scriptIndex + 1));
}
