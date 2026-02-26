import type { ChangeEventHandler, FocusEventHandler, HTMLAttributes, HTMLInputTypeAttribute } from "react";
import React from "react";
import { cn } from "../../lib/utils";

interface InputProperties {
	readonly autoComplete?: string;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly id?: string;
	readonly inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
	readonly max?: number | undefined;
	readonly maxLength?: number | undefined;
	readonly min?: number | undefined;
	readonly name?: string;
	readonly onBlur?: FocusEventHandler<HTMLInputElement>;
	readonly onChange?: ChangeEventHandler<HTMLInputElement>;
	readonly pattern?: string | undefined;
	readonly placeholder?: string | undefined;
	readonly spellCheck?: boolean | undefined;
	readonly step?: string | undefined;
	readonly type?: HTMLInputTypeAttribute;
	readonly value?: number | string | undefined;
}

export function Input({
	autoComplete,
	className,
	disabled = false,
	id,
	inputMode,
	max,
	maxLength,
	min,
	name,
	onBlur,
	onChange,
	pattern,
	placeholder,
	spellCheck,
	step,
	type = "text",
	value,
}: InputProperties): React.ReactNode {
	return (
		<input
			autoComplete={autoComplete}
			className={cn(
				"border-input bg-background/52 ring-offset-background h-10 w-full rounded-xl border px-3 py-1 text-base text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
				"placeholder:text-muted-foreground/90 hover:border-ring/45 disabled:pointer-events-none disabled:opacity-50 md:text-sm",
				className,
			)}
			disabled={disabled}
			id={id}
			inputMode={inputMode}
			max={max}
			maxLength={maxLength}
			min={min}
			name={name}
			onBlur={onBlur}
			onChange={onChange}
			pattern={pattern}
			placeholder={placeholder}
			spellCheck={spellCheck}
			step={step}
			type={type}
			value={value}
		/>
	);
}
