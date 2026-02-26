import React from "react";

interface NumericInputProperties {
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
			<input
				autoComplete="off"
				id={inputId}
				max={max}
				min={min}
				name={inputId}
				onChange={onChange}
				step={step}
				type="number"
				value={value}
			/>
		</label>
	);
}
