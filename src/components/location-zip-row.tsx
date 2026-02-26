import React from "react";
import { Button } from "./ui/button";
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
		<div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
			<ZipInputControl onZipBlur={onZipBlur} onZipChange={onZipChange} zip={zip} />
			<Button
				className="h-11 rounded-xl px-4 md:min-w-32"
				onClick={onZipLookupClick}
				type="button"
				variant="outline"
			>
				Use ZIP Rent
			</Button>
		</div>
	);
}
