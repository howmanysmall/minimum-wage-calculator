import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useCallback, useState } from "react";
import type { FoodPlanTier, HouseholdProfile, TabId } from "../types";

function isFoodPlanTier(value: string): value is FoodPlanTier {
	return value === "thrifty" || value === "low" || value === "moderate" || value === "liberal";
}

function normalizeWholeNumber(rawValue: string, minimumValue: number): number {
	const parsedValue = Number(rawValue);
	if (!Number.isFinite(parsedValue)) return minimumValue;
	return Math.max(minimumValue, Math.floor(parsedValue));
}

interface ProfileState {
	readonly activeTab: TabId;
	readonly householdProfile: HouseholdProfile;
	readonly handleAdultsChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleChildrenChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleFoodPlanTierChange: ChangeEventHandler<HTMLSelectElement>;
	readonly handleHouseholdTabClick: MouseEventHandler<HTMLButtonElement>;
	readonly handleSingleTabClick: MouseEventHandler<HTMLButtonElement>;
}

export function useProfileState(): ProfileState {
	const [activeTab, setActiveTab] = useState<TabId>("single");
	const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile>({
		adults: 1,
		children: 0,
		foodPlanTier: "moderate",
	});

	const handleSingleTabClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
		setActiveTab("single");
	}, []);

	const handleHouseholdTabClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
		setActiveTab("household");
	}, []);

	const handleAdultsChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		const adults = normalizeWholeNumber(event.target.value, 1);
		setHouseholdProfile((previousProfile) => ({ ...previousProfile, adults }));
	}, []);

	const handleChildrenChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		const children = normalizeWholeNumber(event.target.value, 0);
		setHouseholdProfile((previousProfile) => ({ ...previousProfile, children }));
	}, []);

	const handleFoodPlanTierChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((event) => {
		const selectedFoodPlan = event.target.value;
		if (!isFoodPlanTier(selectedFoodPlan)) return;
		setHouseholdProfile((previousProfile) => ({ ...previousProfile, foodPlanTier: selectedFoodPlan }));
	}, []);

	return {
		activeTab,
		handleAdultsChange,
		handleChildrenChange,
		handleFoodPlanTierChange,
		handleHouseholdTabClick,
		handleSingleTabClick,
		householdProfile,
	};
}
