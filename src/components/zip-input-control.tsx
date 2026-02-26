import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ZipInputControlProperties {
	readonly zip: string;
	readonly onZipBlur: React.FocusEventHandler<HTMLInputElement>;
	readonly onZipChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function ZipInputControl({ onZipBlur, onZipChange, zip }: ZipInputControlProperties): React.ReactNode {
	return (
		<div className="space-y-2">
			<Label className="text-foreground/95 text-sm font-semibold" htmlFor="zip-input">
				ZIP Code
			</Label>
			<Input
				autoComplete="postal-code"
				className="h-11 [font-variant-numeric:tabular-nums]"
				id="zip-input"
				inputMode="numeric"
				maxLength={5}
				name="zip"
				onBlur={onZipBlur}
				onChange={onZipChange}
				pattern="[0-9]*"
				placeholder="e.g. 10001…"
				spellCheck={false}
				type="text"
				value={zip}
			/>
		</div>
	);
}
