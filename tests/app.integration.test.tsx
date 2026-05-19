import { describe, expect, it } from "vitest";
import { DEFAULT_ANNUAL_WORK_HOURS } from "@constants/calculator-constants";
import { calculateRequiredWage } from "@functions/calculate-require-wage";
import {
	getFoodBaselineForSingleAdult,
	getHouseholdFoodBaseline,
	lookupZipRentAsync,
} from "@utilities/data-lookup-utilities";

import type { MonthlyCosts } from "@project-types";

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

async function getKnownZipRentAsync(): Promise<number> {
	const rentRecord = await lookupZipRentAsync("76437");
	if (!rentRecord) {
		const error = new TypeError("Expected rent snapshot data for ZIP 76437.");
		Error.captureStackTrace(error, getKnownZipRentAsync);
		throw error;
	}

	return rentRecord.twoBedroom;
}

describe("app integration", () => {
	it("loads ZIP rent and calculates a positive wage output", async () => {
		expect.assertions(3);
		const costs = buildMonthlyCosts(await getKnownZipRentAsync(), getFoodBaselineForSingleAdult("moderate"));
		const result = calculateRequiredWage({
			...costs,
			annualWorkHours: DEFAULT_ANNUAL_WORK_HOURS,
			retirementRate: 0.1,
			savingsRate: 0.1,
		});

		expect(result.monthlyBudget).toBeGreaterThan(0);
		expect(result.hourlyRequired).toBeGreaterThan(0);
		expect(result.annualGrossRequired).toBeGreaterThan(result.monthlyGrossRequired);
	}, 8000);

	it("household food baseline stays above single-adult baseline", () => {
		expect.assertions(2);
		const singleAdultFood = getFoodBaselineForSingleAdult("moderate");
		const householdFood = getHouseholdFoodBaseline({
			adults: 2,
			children: 1,
			foodPlanTier: "moderate",
		});

		expect(singleAdultFood).toBeGreaterThan(0);
		expect(householdFood).toBeGreaterThan(singleAdultFood);
	}, 500);

	it("higher savings and retirement rates require a higher hourly wage", async () => {
		expect.assertions(1);

		const costs = buildMonthlyCosts(await getKnownZipRentAsync(), getFoodBaselineForSingleAdult("moderate"));
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
	}, 8000);
});
