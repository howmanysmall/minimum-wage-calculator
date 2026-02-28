import { regex, type } from "arktype";

export const isFoodPlanTier = type('"thrifty" | "low" | "moderate" | "liberal"');
export type FoodPlanTier = typeof isFoodPlanTier.infer;

export const isTabId = type('"single" | "household"');
export type TabId = typeof isTabId.infer;

// oxlint-disable-next-line unicorn/prefer-string-raw
export const isZipCode = regex("^\\d{5}$");
export type ZipCode = typeof isZipCode.infer;

export const isMonthlyCosts = type({
	foodMonthly: "number",
	healthMonthly: "number",
	internetPhoneMonthly: "number",
	rentMonthly: "number",
	transportMonthly: "number",
	utilitiesMonthly: "number",
}).readonly();
export type MonthlyCosts = typeof isMonthlyCosts.infer;

export const isWageInput = isMonthlyCosts
	.and({
		annualWorkHours: "number",
		retirementRate: "number",
		savingsRate: "number",
	})
	.readonly();
export type WageInput = typeof isWageInput.infer;

export const isWageResult = type({
	annualGrossRequired: "number",
	hourlyRequired: "number",
	monthlyBudget: "number",
	monthlyGrossRequired: "number",
}).readonly();
export type WageResult = typeof isWageResult.infer;

export const isHouseholdProfile = type({
	adults: "number % 1",
	children: "number % 1",
	foodPlanTier: isFoodPlanTier,
}).readonly();
export type HouseholdProfile = typeof isHouseholdProfile.infer;

export const isZipRentRecord = type({
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
export type RentSnapshot = typeof isRentSnapshot.infer;

export const isFoodTierValues = type({
	liberal: "number",
	low: "number",
	moderate: "number",
	thrifty: "number",
}).readonly();
export type FoodTierValues = typeof isFoodTierValues.infer;

export const isFoodSnapshot = type({
	adultPerPerson: isFoodTierValues,
	childPerPerson: isFoodTierValues,
	notes: "string",
	singleAdult: isFoodTierValues,
	sourceMonth: "string",
	sourceUrl: "string",
	sourceYear: "number % 1",
});
export type FoodSnapshot = typeof isFoodSnapshot.infer;

export const isVersionSnapshot = type({
	appBuiltAt: "string",
	foodAsOf: "string",
	rentAsOf: "string",
}).readonly();
export type VersionSnapshot = typeof isVersionSnapshot.infer;
