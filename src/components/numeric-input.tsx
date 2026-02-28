import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface NumericInputProperties {
	readonly inputId: string;
	readonly label: string;
	readonly max?: number;
	readonly min: number;
	readonly onChange: React.ChangeEventHandler<HTMLInputElement>;
	readonly step: string;
	readonly value: number;
}

export function NumericInput({
	inputId,
	label,
	max,
	min,
	onChange,
	step,
	value,
}: NumericInputProperties): React.ReactNode {
	return (
		<div className="space-y-2">
			<Label className="text-foreground/95 text-sm font-semibold" htmlFor={inputId}>
				{label}
			</Label>
			<Input
				autoComplete="off"
				className="h-11 [font-variant-numeric:tabular-nums]"
				id={inputId}
				max={max}
				min={min}
				name={inputId}
				onChange={onChange}
				step={step}
				type="number"
				value={value}
			/>
		</div>
	);
}
