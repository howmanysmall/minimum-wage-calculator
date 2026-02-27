import { describe, expect, test } from "bun:test";
import { calculateRequiredWage } from "./lib/calc";
import { DEFAULT_ANNUAL_WORK_HOURS } from "./lib/calculator-constants";
import { getFoodBaselineForSingleAdult, getHouseholdFoodBaseline, lookupZipRentAsync } from "./lib/data-lookup";
import type { MonthlyCosts } from "./types";

function buildMonthlyCosts(rentMonthly: number, foodMonthly: number): MonthlyCosts {
	return {
		foodMonthly,
		healthMonthly: 360,
		internetPhoneMonthly: 130,
		rentMonthly,
		transportMonthly: 220,
		utilitiesMonthly: 240,
	};
}

async function getKnownZipRent(): Promise<number> {
	const rentRecord = await lookupZipRentAsync("76437");
	if (!rentRecord) throw new TypeError("Expected rent snapshot data for ZIP 76437.");

	return rentRecord.twoBedroom;
}

describe("app integration", () => {
	test("loads ZIP rent and calculates a positive wage output", async () => {
		const costs = buildMonthlyCosts(await getKnownZipRent(), getFoodBaselineForSingleAdult("moderate"));
		const result = calculateRequiredWage({
			...costs,
			annualWorkHours: DEFAULT_ANNUAL_WORK_HOURS,
			retirementRate: 0.1,
			savingsRate: 0.1,
		});

		expect(result.monthlyBudget).toBeGreaterThan(0);
		expect(result.hourlyRequired).toBeGreaterThan(0);
		expect(result.annualGrossRequired).toBeGreaterThan(result.monthlyGrossRequired);
	});

	test("household food baseline stays above single-adult baseline", () => {
		const singleAdultFood = getFoodBaselineForSingleAdult("moderate");
		const householdFood = getHouseholdFoodBaseline({
			adults: 2,
			children: 1,
			foodPlanTier: "moderate",
		});

		expect(singleAdultFood).toBeGreaterThan(0);
		expect(householdFood).toBeGreaterThan(singleAdultFood);
	});

	test("higher savings and retirement rates require a higher hourly wage", async () => {
		const costs = buildMonthlyCosts(await getKnownZipRent(), getFoodBaselineForSingleAdult("moderate"));
		const baseRatesResult = calculateRequiredWage({
			...costs,
			annualWorkHours: DEFAULT_ANNUAL_WORK_HOURS,
			retirementRate: 0,
			savingsRate: 0,
		});
		const higherRatesResult = calculateRequiredWage({
			...costs,
			annualWorkHours: DEFAULT_ANNUAL_WORK_HOURS,
			retirementRate: 0.2,
			savingsRate: 0.2,
		});

		expect(higherRatesResult.hourlyRequired).toBeGreaterThan(baseRatesResult.hourlyRequired);
	});
});
