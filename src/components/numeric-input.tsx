import React from "react";

export interface NumericInputProperties {
	readonly inputId: string;
	readonly label: string;
	readonly min: number;
	readonly max?: number;
	readonly step: string;
	readonly value: number;
	readonly onChange: React.ChangeEventHandler<HTMLInputElement>;
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
		<label htmlFor={inputId}>
			{label}
			<input id={inputId} max={max} min={min} onChange={onChange} step={step} type="number" value={value} />
		</label>
	);
}
