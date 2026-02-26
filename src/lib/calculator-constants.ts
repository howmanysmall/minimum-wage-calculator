import type { MonthlyCosts } from "../types";

interface CostField {
	readonly key: keyof MonthlyCosts;
	readonly label: string;
	readonly hint: string;
	readonly step?: string;
}

export const DEFAULT_SAVINGS_RATE_PERCENT = 10;
export const DEFAULT_RETIREMENT_RATE_PERCENT = 10;
export const DEFAULT_ANNUAL_WORK_HOURS = 2080;

export const BASE_MONTHLY_COSTS: Omit<MonthlyCosts, "foodMonthly"> = {
	healthMonthly: 360,
	internetPhoneMonthly: 130,
	rentMonthly: 0,
	transportMonthly: 220,
	utilitiesMonthly: 240,
};

export const COST_FIELDS: Array<CostField> = [
	{ hint: "HUD 2BR SAFMR autofill from ZIP when available.", key: "rentMonthly", label: "Rent (H_r)" },
	{ hint: "USDA food-plan baseline, editable.", key: "foodMonthly", label: "Food (F_p)" },
	{ hint: "Monthly transit + fuel + rideshare.", key: "transportMonthly", label: "Transport (T_t)" },
	{ hint: "Monthly connectivity costs.", key: "internetPhoneMonthly", label: "Internet + Phone (I_p)" },
	{ hint: "Power, water, and related utility bills.", key: "utilitiesMonthly", label: "Utilities (U_p)" },
	{ hint: "Approximate ACA Silver monthly premium.", key: "healthMonthly", label: "Health (M_p)" },
];
