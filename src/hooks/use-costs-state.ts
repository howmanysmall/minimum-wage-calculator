import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { BASE_MONTHLY_COSTS } from "../lib/calculator-constants";
import { getFoodBaselineForSingleAdult, getHouseholdFoodBaseline } from "../lib/data-lookup";
import type { HouseholdProfile, MonthlyCosts, TabId } from "../types";

const MONTHLY_COST_KEY_RECORD: Record<keyof MonthlyCosts, true> = {
	foodMonthly: true,
	healthMonthly: true,
	internetPhoneMonthly: true,
	rentMonthly: true,
	transportMonthly: true,
	utilitiesMonthly: true,
};

function isMonthlyCostKey(value: string): value is keyof MonthlyCosts {
	return value in MONTHLY_COST_KEY_RECORD;
}

function normalizeCost(rawValue: string): number {
	const parsedValue = Number(rawValue);
	if (!Number.isFinite(parsedValue)) return 0;
	return Math.max(0, parsedValue);
}

export interface CostsState {
	readonly applyRentToAllProfiles: (rentMonthly: number) => void;
	readonly currentCosts: MonthlyCosts;
	readonly handleApplyHouseholdFoodRecommendation: MouseEventHandler<HTMLButtonElement>;
	readonly handleCostInputChange: ChangeEventHandler<HTMLInputElement>;
	readonly householdFoodRecommendation: number;
}

export function useCostsState(activeTab: TabId, householdProfile: HouseholdProfile): CostsState {
	const [singleCosts, setSingleCosts] = useState<MonthlyCosts>({
		...BASE_MONTHLY_COSTS,
		foodMonthly: getFoodBaselineForSingleAdult("moderate"),
	});
	const [householdCosts, setHouseholdCosts] = useState<MonthlyCosts>({
		...BASE_MONTHLY_COSTS,
		foodMonthly: getHouseholdFoodBaseline({ adults: 1, children: 0, foodPlanTier: "moderate" }),
	});
	const currentCosts = activeTab === "single" ? singleCosts : householdCosts;

	const householdFoodRecommendation = getHouseholdFoodBaseline(householdProfile);
	function handleCostInputChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
		if (!isMonthlyCostKey(target.id)) return;

		const nextValue = normalizeCost(target.value);
		if (activeTab === "single") {
			setSingleCosts((previousCosts) => ({ ...previousCosts, [target.id]: nextValue }));
			return;
		}
		setHouseholdCosts((previousCosts) => ({ ...previousCosts, [target.id]: nextValue }));
	}

	function handleApplyHouseholdFoodRecommendation(): void {
		setHouseholdCosts((previousCosts) => ({ ...previousCosts, foodMonthly: householdFoodRecommendation }));
	}

	function applyRentToAllProfiles(rentMonthly: number): void {
		setSingleCosts((previousCosts) => ({ ...previousCosts, rentMonthly }));
		setHouseholdCosts((previousCosts) => ({ ...previousCosts, rentMonthly }));
	}

	return {
		applyRentToAllProfiles,
		currentCosts,
		handleApplyHouseholdFoodRecommendation,
		handleCostInputChange,
		householdFoodRecommendation,
	};
}
