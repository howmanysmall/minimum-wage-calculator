import type { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from "react";
import type { HouseholdProfile, MonthlyCosts, TabId } from "../types";

export interface LocationSectionProperties {
	readonly locationName: string;
	readonly zip: string;
	readonly zipStatus: string;
	readonly onZipBlur: FocusEventHandler<HTMLInputElement>;
	readonly onZipChange: ChangeEventHandler<HTMLInputElement>;
	readonly onZipLookupClick: MouseEventHandler<HTMLButtonElement>;
}

export interface AssumptionsSectionProperties {
	readonly annualWorkHours: number;
	readonly retirementRatePct: number;
	readonly savingsRatePct: number;
	readonly onWorkHoursChange: ChangeEventHandler<HTMLInputElement>;
	readonly onRetirementRateChange: ChangeEventHandler<HTMLInputElement>;
	readonly onSavingsRateChange: ChangeEventHandler<HTMLInputElement>;
}

export interface ProfileSectionProperties {
	readonly activeTab: TabId;
	readonly householdFoodRecommendation: number;
	readonly householdProfile: HouseholdProfile;
	readonly onAdultsChange: ChangeEventHandler<HTMLInputElement>;
	readonly onApplyHouseholdFoodRecommendation: MouseEventHandler<HTMLButtonElement>;
	readonly onChildrenChange: ChangeEventHandler<HTMLInputElement>;
	readonly onFoodPlanTierChange: ChangeEventHandler<HTMLSelectElement>;
	readonly onHouseholdTabClick: MouseEventHandler<HTMLButtonElement>;
	readonly onSingleTabClick: MouseEventHandler<HTMLButtonElement>;
}

export interface MonthlyCostsSectionProperties {
	readonly costs: MonthlyCosts;
	readonly onCostInputChange: ChangeEventHandler<HTMLInputElement>;
}
