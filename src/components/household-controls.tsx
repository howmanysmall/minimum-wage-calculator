import React from "react";
import { formatCurrency } from "../lib/format";
import type { HouseholdProfile } from "../types";
import { FoodPlanSelect } from "./food-plan-select";
import { NumericInput } from "./numeric-input";
import { Button } from "./ui/button";

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
		<div className="space-y-4">
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
			<div className="border-border/62 bg-muted/45 rounded-xl border p-3 md:flex md:items-center md:justify-between md:gap-4">
				<p className="text-foreground/90 text-sm leading-relaxed font-semibold [font-variant-numeric:tabular-nums]">
					Recommended household food baseline: {formatCurrency(householdFoodRecommendation)} / month
				</p>
				<Button
					className="mt-3 h-10 rounded-xl md:mt-0"
					onClick={onApplyHouseholdFoodRecommendation}
					type="button"
					variant="secondary"
				>
					Apply Recommendation
				</Button>
			</div>
		</div>
	);
}
