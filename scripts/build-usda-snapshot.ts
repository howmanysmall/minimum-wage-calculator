#!/usr/bin/env bun

import { Command } from "@jsr/cliffy__command";
import type { FoodSnapshot } from "../src/types";

type TierName = "low" | "moderate" | "liberal";

interface ThriftyValues {
	readonly adult: number;
	readonly child: number;
}

interface TierValues {
	readonly low: number;
	readonly moderate: number;
	readonly liberal: number;
}

interface ThreeLevelValues {
	readonly adult: TierValues;
	readonly child: TierValues;
}

const MONTH_YEAR_PATTERN = /Cost of Food at Home at Three Levels:\s*U\.S\. Average,\s*([A-Za-z]+)\s+(\d{4})/i;
const TABLE_PATTERN = /<table[^>]*>.*?<\/table>/is;
const ROW_PATTERN = /<tr[^>]*>(.*?)<\/tr>/gis;
const CELL_PATTERN = /<t[dh][^>]*>(.*?)<\/t[dh]>/gis;
const TAG_PATTERN = /<[^>]+>/g;
const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;
const CURRENCY_CLEAN_PATTERN = /[^0-9.-]/g;
const DECIMAL_HTML_ENTITY_PATTERN = /&#(\d+);/g;
const NAMED_HTML_ENTITY_PATTERN = /&[a-z]+;/gi;
const WHITESPACE_PATTERN = /\s+/g;

const HTML_ENTITY_MAP = {
	"&#39;": "'",
	"&amp;": "&",
	"&gt;": ">",
	"&lt;": "<",
	"&nbsp;": " ",
	"&quot;": '"',
} as const;
const ENTRIES = Object.entries(HTML_ENTITY_MAP);

const THRIFTY_HEADING_PREFIX = String.raw`Thrifty Food Plan:\s*`;
const THREE_LEVEL_HEADING_PREFIX = String.raw`Cost of Food at Home at Three Levels:\s*U\.S\. Average,\s*`;

async function fetchTextAsync(url: string): Promise<string> {
	const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
	if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${url}`);
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
	if (!cleaned) throw new Error(`Unable to parse currency value: ${JSON.stringify(value)}`);
	return Number.parseFloat(cleaned);
}

function escapeRegex(value: string): string {
	return value.replaceAll(REGEX_ESCAPE_PATTERN, String.raw`\$&`);
}

function extractTableAfterHeading(pageHtml: string, headingPattern: RegExp): string {
	const headingMatch = headingPattern.exec(pageHtml);
	if (!headingMatch) throw new Error(`Heading not found for pattern: ${headingPattern.source}`);

	const segment = pageHtml.slice(headingMatch.index + headingMatch[0].length);
	const tableMatch = TABLE_PATTERN.exec(segment);
	if (!tableMatch) throw new Error(`Table not found after heading pattern: ${headingPattern.source}`);

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

function parseThriftyRows(rows: ReadonlyArray<ReadonlyArray<string>>): ThriftyValues {
	let section = "";
	let femaleAdult: number | undefined;
	let maleAdult: number | undefined;
	let childValue: number | undefined;
	for (const cells of rows) {
		const label = cells[0]?.toLowerCase() ?? "";
		if (label === "female" || label === "male" || label === "child") {
			section = label;
			continue;
		}

		if (cells.length < 3) continue;
		if (label === "20-50 years") {
			const monthlyRawValue = cells.at(2);
			if (typeof monthlyRawValue !== "string") continue;
			const parsedValue = parseCurrency(monthlyRawValue);
			if (section === "female") femaleAdult = parsedValue;
			if (section === "male") maleAdult = parsedValue;
		}

		if (label === "9-11 years" && section === "child") {
			const childRawValue = cells.at(2);
			if (typeof childRawValue !== "string") continue;
			childValue = parseCurrency(childRawValue);
		}
	}

	if (femaleAdult === undefined || maleAdult === undefined || childValue === undefined) {
		throw new Error("Missing required Thrifty table values for 20-50 years and/or 9-11 years.");
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

function parseThreeLevelRows(rows: ReadonlyArray<ReadonlyArray<string>>): ThreeLevelValues {
	let section = "";
	let femaleAdult: TierValues | undefined;
	let maleAdult: TierValues | undefined;
	let childValues: TierValues | undefined;
	for (const cells of rows) {
		const label = cells[0]?.toLowerCase() ?? "";
		if (label === "female" || label === "male" || label === "child") {
			section = label;
			continue;
		}

		if (cells.length < 7) continue;
		const rowValues = parseThreeLevelRowValues(cells);
		if (rowValues === undefined) continue;
		if (label === "20-50 years" && section === "female") femaleAdult = rowValues;
		if (label === "20-50 years" && section === "male") maleAdult = rowValues;
		if (label === "9-11 years" && section === "child") childValues = rowValues;
	}

	if (femaleAdult === undefined || maleAdult === undefined || childValues === undefined) {
		throw new Error("Missing required three-level values for 20-50 years and/or 9-11 years.");
	}

	const adult = new Array<TierName>("low", "moderate", "liberal");
	const adultResult: Record<TierName, number> = { liberal: 0, low: 0, moderate: 0 };
	for (const tier of adult) adultResult[tier] = Math.round((femaleAdult[tier] + maleAdult[tier]) / 2);

	const childResult: Record<TierName, number> = { liberal: 0, low: 0, moderate: 0 };
	for (const tier of adult) childResult[tier] = Math.round(childValues[tier]);

	return { adult: adultResult, child: childResult };
}

function createHeadingPattern(prefix: string, month: string, year: number): RegExp {
	return new RegExp(`${prefix}${escapeRegex(month)}\\s+${year}`, "i");
}

async function parseUsdaFoodSnapshotAsync(sourceUrl: string): Promise<FoodSnapshot> {
	const pageHtml = await fetchTextAsync(sourceUrl);
	const monthYearMatch = MONTH_YEAR_PATTERN.exec(pageHtml);
	if (!monthYearMatch) throw new Error("Unable to find latest month/year label on USDA page.");

	const [, sourceMonthRaw, sourceYearRaw] = monthYearMatch;
	if (typeof sourceMonthRaw !== "string" || typeof sourceYearRaw !== "string") {
		throw new TypeError("Unable to parse month/year values from USDA heading.");
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
	await Bun.write(output, JSON.stringify(payload), { createPath: true });
	console.log(`Wrote USDA food snapshot (${payload.sourceMonth} ${payload.sourceYear}) -> ${output}`);
}

if (import.meta.main) {
	await new Command()
		.name("build-usda-snapshot")
		.version("1.0.0")
		.description("Build USDA food snapshot JSON from the USDA monthly report page.")
		.option("--output <path:string>", "Output JSON path", { required: true })
		.option("--source-url <url:string>", "USDA monthly report page URL", { required: true })
		.action(async ({ output, sourceUrl }) => {
			await buildUsdaSnapshotAsync(output, sourceUrl);
		})
		.parse(Bun.argv.slice(2));
}
