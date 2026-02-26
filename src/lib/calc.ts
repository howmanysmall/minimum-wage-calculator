import type { WageInput, WageResult } from "../types";

const MIN_RATE = 0;
const MAX_RATE = 1;

function assertFinite(name: string, value: number): void {
	if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`);
}

export function calculateRequiredWage(input: WageInput): WageResult {
	assertFinite("Savings rate", input.savingsRate);
	assertFinite("Retirement rate", input.retirementRate);
	assertFinite("Annual work hours", input.annualWorkHours);

	if (input.savingsRate < MIN_RATE || input.savingsRate > MAX_RATE) {
		throw new Error("Savings rate must be between 0 and 1.");
	}

	if (input.retirementRate < MIN_RATE || input.retirementRate > MAX_RATE) {
		throw new Error("Retirement rate must be between 0 and 1.");
	}

	if (input.annualWorkHours <= 0) {
		throw new Error("Annual work hours must be greater than zero.");
	}

	const monthlyCosts = [
		input.rentMonthly,
		input.foodMonthly,
		input.transportMonthly,
		input.internetPhoneMonthly,
		input.utilitiesMonthly,
		input.healthMonthly,
	];

	for (const [index, value] of monthlyCosts.entries()) {
		assertFinite(`Monthly cost #${index + 1}`, value);
		if (value < 0) throw new Error("Monthly costs cannot be negative.");
	}

	const monthlyBudget = monthlyCosts.reduce((sum, value) => sum + value, 0);
	const monthlyGrossRequired = monthlyBudget * (1 + input.savingsRate + input.retirementRate);
	const annualGrossRequired = monthlyGrossRequired * 12;
	const hourlyRequired = annualGrossRequired / input.annualWorkHours;

	return {
		annualGrossRequired,
		hourlyRequired,
		monthlyBudget,
		monthlyGrossRequired,
	};
}
