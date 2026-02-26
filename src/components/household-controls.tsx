import React from "react";
import { formatCurrency } from "../lib/format";
import type { HouseholdProfile } from "../types";
import { FoodPlanSelect } from "./food-plan-select";
import { NumericInput } from "./numeric-input";

interface HouseholdControlsProperties {
	readonly householdFoodRecommendation: number;
	readonly householdProfile: HouseholdProfile;
	readonly onAdultsChange: React.ChangeEventHandler<HTMLInputElement>;
	readonly onApplyHouseholdFoodRecommendation: React.MouseEventHandler<HTMLButtonElement>;
	readonly onChildrenChange: React.ChangeEventHandler<HTMLInputElement>;
	readonly onFoodPlanTierChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export function HouseholdControls({
	householdFoodRecommendation,
	householdProfile,
	onAdultsChange,
	onApplyHouseholdFoodRecommendation,
	onChildrenChange,
	onFoodPlanTierChange,
}: HouseholdControlsProperties): React.ReactNode {
	return (
		<div className="household-controls">
			<div className="input-grid three-up">
				<NumericInput
					inputId="household-adults"
					label="Adults"
					min={1}
					onChange={onAdultsChange}
					step="1"
					value={householdProfile.adults}
				/>
				<NumericInput
					inputId="household-children"
					label="Children"
					min={0}
					onChange={onChildrenChange}
					step="1"
					value={householdProfile.children}
				/>
				<FoodPlanSelect onChange={onFoodPlanTierChange} value={householdProfile.foodPlanTier} />
			</div>
			<div className="recommendation-row">
				<p>Recommended household food baseline: {formatCurrency(householdFoodRecommendation)} / month</p>
				<button className="secondary" onClick={onApplyHouseholdFoodRecommendation} type="button">
					Apply Recommendation
				</button>
			</div>
		</div>
	);
}
