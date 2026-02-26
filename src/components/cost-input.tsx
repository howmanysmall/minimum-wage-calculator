import React from "react";
import type { MonthlyCosts } from "../types";

interface CostInputProperties {
	readonly costKey: keyof MonthlyCosts;
	readonly label: string;
	readonly hint: string;
	readonly step?: string | undefined;
	readonly value: number;
	readonly onCostInputChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function CostInput({
	costKey,
	hint,
	label,
	onCostInputChange,
	step,
	value,
}: CostInputProperties): React.ReactNode {
	return (
		<label htmlFor={costKey}>
			{label}
			<input
				autoComplete="off"
				id={costKey}
				min={0}
				name={costKey}
				onChange={onCostInputChange}
				step={step ?? "1"}
				type="number"
				value={value}
			/>
			<span className="hint">{hint}</span>
		</label>
	);
}
