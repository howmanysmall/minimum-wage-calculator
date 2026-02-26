import React from "react";

interface ZipInputControlProperties {
	readonly zip: string;
	readonly onZipBlur: React.FocusEventHandler<HTMLInputElement>;
	readonly onZipChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function ZipInputControl({ onZipBlur, onZipChange, zip }: ZipInputControlProperties): React.ReactNode {
	return (
		<label htmlFor="zip-input">
			ZIP Code
			<input
				autoComplete="postal-code"
				id="zip-input"
				inputMode="numeric"
				maxLength={5}
				onBlur={onZipBlur}
				onChange={onZipChange}
				pattern="[0-9]*"
				placeholder="e.g. 10001"
				value={zip}
			/>
		</label>
	);
}
