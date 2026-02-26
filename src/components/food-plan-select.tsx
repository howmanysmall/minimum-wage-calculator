import React from "react";
import type { HouseholdProfile } from "../types";
import { Label } from "./ui/label";

interface FoodPlanSelectProperties {
	readonly onChange: React.ChangeEventHandler<HTMLSelectElement>;
	readonly value: HouseholdProfile["foodPlanTier"];
}

export function FoodPlanSelect({ onChange, value }: FoodPlanSelectProperties): React.ReactNode {
	return (
		<div className="space-y-2">
			<Label className="text-foreground/95 text-sm font-semibold" htmlFor="food-tier">
				Food Plan
			</Label>
			<select
				className="border-input bg-background/52 ring-offset-background focus-visible:ring-ring/50 focus-visible:border-ring text-foreground hover:border-ring/45 h-11 w-full rounded-xl border px-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none focus-visible:ring-[3px]"
				id="food-tier"
				name="foodTier"
				onChange={onChange}
				value={value}
			>
				<option value="thrifty">Thrifty</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="liberal">Liberal</option>
			</select>
		</div>
	);
}
