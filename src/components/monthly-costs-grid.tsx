import React from "react";
import { COST_FIELDS } from "@constants/calculator-constants";

import { CostInput } from "./cost-input";

import type { MonthlyCosts } from "@project-types";
import type { ChangeEventHandler } from "react";

export interface MonthlyCostsGridProperties {
	readonly costs: MonthlyCosts;
	readonly onCostInputChange: ChangeEventHandler<HTMLInputElement>;
}

export function MonthlyCostsGrid({ costs, onCostInputChange }: MonthlyCostsGridProperties): React.ReactNode {
	return (
		<div className="grid gap-4">
			{COST_FIELDS.map((field) => (
				<CostInput
					costKey={field.key}
					hint={field.hint}
					key={field.key}
					label={field.label}
					onCostInputChange={onCostInputChange}
					step={field.step}
					value={costs[field.key]}
				/>
			))}
		</div>
	);
}
