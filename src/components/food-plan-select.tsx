import React from "react";
import type { HouseholdProfile } from "../types";

export interface FoodPlanSelectProperties {
	readonly onChange: React.ChangeEventHandler<HTMLSelectElement>;
	readonly value: HouseholdProfile["foodPlanTier"];
}

export function FoodPlanSelect({ onChange, value }: FoodPlanSelectProperties): React.ReactNode {
	return (
		<label htmlFor="food-tier">
			Food Plan
			<select id="food-tier" onChange={onChange} value={value}>
				<option value="thrifty">Thrifty</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="liberal">Liberal</option>
			</select>
		</label>
	);
}
