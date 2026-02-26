import { describe, expect, test } from "bun:test";
import { calculateRequiredWage } from "./calc";

describe("calculateRequiredWage", () => {
	test("calculates monthly, annual, and hourly requirements", () => {
		const result = calculateRequiredWage({
			annualWorkHours: 2080,
			foodMonthly: 450,
			healthMonthly: 360,
			internetPhoneMonthly: 130,
			rentMonthly: 1200,
			retirementRate: 0.1,
			savingsRate: 0.1,
			transportMonthly: 220,
			utilitiesMonthly: 240,
		});

		expect(result.monthlyBudget).toBe(2600);
		expect(result.monthlyGrossRequired).toBeCloseTo(3120, 6);
		expect(result.annualGrossRequired).toBeCloseTo(37_440, 6);
		expect(result.hourlyRequired).toBeCloseTo(18, 5);
	});

	test("supports zero savings and retirement rates", () => {
		const result = calculateRequiredWage({
			annualWorkHours: 2000,
			foodMonthly: 150,
			healthMonthly: 15,
			internetPhoneMonthly: 40,
			rentMonthly: 700,
			retirementRate: 0,
			savingsRate: 0,
			transportMonthly: 50,
			utilitiesMonthly: 45,
		});

		expect(result.monthlyBudget).toBe(1000);
		expect(result.annualGrossRequired).toBe(12_000);
		expect(result.hourlyRequired).toBe(6);
	});

	test("throws on invalid values", () => {
		expect(() =>
			calculateRequiredWage({
				annualWorkHours: 2080,
				foodMonthly: 100,
				healthMonthly: 100,
				internetPhoneMonthly: 100,
				rentMonthly: -1,
				retirementRate: 0.1,
				savingsRate: 0.1,
				transportMonthly: 100,
				utilitiesMonthly: 100,
			}),
		).toThrow("Monthly costs cannot be negative.");

		expect(() =>
			calculateRequiredWage({
				annualWorkHours: 0,
				foodMonthly: 100,
				healthMonthly: 100,
				internetPhoneMonthly: 100,
				rentMonthly: 100,
				retirementRate: 0.1,
				savingsRate: 0.1,
				transportMonthly: 100,
				utilitiesMonthly: 100,
			}),
		).toThrow("Annual work hours must be greater than zero.");
	});
});
