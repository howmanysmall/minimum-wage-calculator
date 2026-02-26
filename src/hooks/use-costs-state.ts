import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useCallback, useMemo, useState } from "react";
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

export function useCostsState(
	activeTab: TabId,
	householdProfile: HouseholdProfile,
): {
	currentCosts: MonthlyCosts;
	householdFoodRecommendation: number;
	handleApplyHouseholdFoodRecommendation: MouseEventHandler<HTMLButtonElement>;
	handleCostInputChange: ChangeEventHandler<HTMLInputElement>;
	applyRentToAllProfiles: (rentMonthly: number) => void;
} {
	const [singleCosts, setSingleCosts] = useState<MonthlyCosts>({
		...BASE_MONTHLY_COSTS,
		foodMonthly: getFoodBaselineForSingleAdult("moderate"),
	});
	const [householdCosts, setHouseholdCosts] = useState<MonthlyCosts>({
		...BASE_MONTHLY_COSTS,
		foodMonthly: getHouseholdFoodBaseline({ adults: 1, children: 0, foodPlanTier: "moderate" }),
	});
	const currentCosts = activeTab === "single" ? singleCosts : householdCosts;
	const householdFoodRecommendation = useMemo(() => getHouseholdFoodBaseline(householdProfile), [householdProfile]);
	const handleCostInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			if (!isMonthlyCostKey(event.target.id)) return;

			const nextValue = normalizeCost(event.target.value);
			if (activeTab === "single") {
				setSingleCosts((previousCosts) => ({ ...previousCosts, [event.target.id]: nextValue }));
				return;
			}
			setHouseholdCosts((previousCosts) => ({ ...previousCosts, [event.target.id]: nextValue }));
		},
		[activeTab],
	);
	const handleApplyHouseholdFoodRecommendation = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
		setHouseholdCosts((previousCosts) => ({ ...previousCosts, foodMonthly: householdFoodRecommendation }));
	}, [householdFoodRecommendation]);
	const applyRentToAllProfiles = useCallback((rentMonthly: number) => {
		setSingleCosts((previousCosts) => ({ ...previousCosts, rentMonthly }));
		setHouseholdCosts((previousCosts) => ({ ...previousCosts, rentMonthly }));
	}, []);
	return {
		applyRentToAllProfiles,
		currentCosts,
		handleApplyHouseholdFoodRecommendation,
		handleCostInputChange,
		householdFoodRecommendation,
	};
}
