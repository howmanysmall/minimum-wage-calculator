import React from "react";
import { ZipInputControl } from "./zip-input-control";

interface LocationZipRowProperties {
	readonly zip: string;
	readonly onZipBlur: React.FocusEventHandler<HTMLInputElement>;
	readonly onZipChange: React.ChangeEventHandler<HTMLInputElement>;
	readonly onZipLookupClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function LocationZipRow({
	onZipBlur,
	onZipChange,
	onZipLookupClick,
	zip,
}: LocationZipRowProperties): React.ReactNode {
	return (
		<div className="zip-row">
			<ZipInputControl onZipBlur={onZipBlur} onZipChange={onZipChange} zip={zip} />
			<button className="secondary" onClick={onZipLookupClick} type="button">
				Use ZIP Rent
			</button>
		</div>
	);
}
