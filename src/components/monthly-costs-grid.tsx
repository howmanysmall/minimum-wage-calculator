import type { ChangeEventHandler } from "react";
import React from "react";
import { COST_FIELDS } from "../lib/calculator-constants";
import type { MonthlyCosts } from "../types";
import { CostInput } from "./cost-input";

interface MonthlyCostsGridProperties {
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
