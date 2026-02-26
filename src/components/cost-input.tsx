import React from "react";
import type { MonthlyCosts } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
		<div className="space-y-2">
			<Label className="text-foreground/95 text-sm font-semibold" htmlFor={costKey}>
				{label}
			</Label>
			<Input
				autoComplete="off"
				className="h-11 [font-variant-numeric:tabular-nums]"
				id={costKey}
				min={0}
				name={costKey}
				onChange={onCostInputChange}
				step={step ?? "1"}
				type="number"
				value={value}
			/>
			<p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>
		</div>
	);
}
