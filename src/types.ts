import { regex, type } from "arktype";

const isFoodPlanTier = type('"thrifty" | "low" | "moderate" | "liberal"');
export type FoodPlanTier = typeof isFoodPlanTier.infer;

const isTabId = type('"single" | "household"');
export type TabId = typeof isTabId.infer;

// oxlint-disable-next-line unicorn/prefer-string-raw
const isZipCode = regex("^\\d{5}$", "u");

const isMonthlyCosts = type({
	foodMonthly: "number",
	healthMonthly: "number",
	internetPhoneMonthly: "number",
	rentMonthly: "number",
	transportMonthly: "number",
	utilitiesMonthly: "number",
}).readonly();
export type MonthlyCosts = typeof isMonthlyCosts.infer;

const isWageInput = isMonthlyCosts
	.and({
		annualWorkHours: "number",
		retirementRate: "number",
		savingsRate: "number",
	})
	.readonly();
export type WageInput = typeof isWageInput.infer;

const isWageResult = type({
	annualGrossRequired: "number",
	hourlyRequired: "number",
	monthlyBudget: "number",
	monthlyGrossRequired: "number",
}).readonly();
export type WageResult = typeof isWageResult.infer;

const isHouseholdProfile = type({
	adults: "number % 1",
	children: "number % 1",
	foodPlanTier: isFoodPlanTier,
}).readonly();
export type HouseholdProfile = typeof isHouseholdProfile.infer;

const isZipRentRecord = type({
	hudAreaCode: "string",
	hudAreaName: "string",
	sourceYear: "number % 1",
	twoBedroom: "number",
	zip: isZipCode,
}).readonly();
export type ZipRentRecord = typeof isZipRentRecord.infer;

export const isRentSnapshot = type({
	generatedAt: "string",
	recordCount: "number % 1",
	records: isZipRentRecord.array().readonly(),
	sourceUrl: "string",
	sourceYear: "number % 1",
}).readonly();

const isFoodTierValues = type({
	liberal: "number",
	low: "number",
	moderate: "number",
	thrifty: "number",
}).readonly();

const isFoodSnapshot = type({
	adultPerPerson: isFoodTierValues,
	childPerPerson: isFoodTierValues,
	notes: "string",
	singleAdult: isFoodTierValues,
	sourceMonth: "string",
	sourceUrl: "string",
	sourceYear: "number % 1",
});
export type FoodSnapshot = typeof isFoodSnapshot.infer;

const isVersionSnapshot = type({
	appBuiltAt: "string",
	foodAsOf: "string",
	rentAsOf: "string",
}).readonly();
export type VersionSnapshot = typeof isVersionSnapshot.infer;
