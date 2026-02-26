import type { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { isZipFormatValid, lookupZipRent, normalizeZip } from "../lib/data-lookup";

function lookupAndApplyRent(
	zip: string,
	setZip: (value: string) => void,
	setZipStatus: (value: string) => void,
	setLocationName: (value: string) => void,
	applyRentToAllProfiles: (rentMonthly: number) => void,
): void {
	const normalizedZip = normalizeZip(zip);
	setZip(normalizedZip);
	if (!isZipFormatValid(normalizedZip)) {
		setZipStatus("Enter a valid 5-digit ZIP code.");
		setLocationName("");
		return;
	}

	const rentRecord = lookupZipRent(normalizedZip);
	if (!rentRecord) {
		setZipStatus(`No rent snapshot match for ZIP ${normalizedZip}. Enter rent manually.`);
		setLocationName("");
		return;
	}

	setLocationName(rentRecord.hudAreaName);
	setZipStatus(`Loaded HUD 2BR rent snapshot for ZIP ${normalizedZip}.`);
	applyRentToAllProfiles(rentRecord.twoBedroom);
}

export interface LocationState {
	readonly locationName: string;
	readonly zip: string;
	readonly zipStatus: string;
	readonly handleZipBlur: FocusEventHandler<HTMLInputElement>;
	readonly handleZipChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleZipLookupClick: MouseEventHandler<HTMLButtonElement>;
}

export function useLocationState(applyRentToAllProfiles: (rentMonthly: number) => void): LocationState {
	const [locationName, setLocationName] = useState("");
	const [zip, setZip] = useState("");
	const [zipStatus, setZipStatus] = useState("");

	function handleZipChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
		setZip(normalizeZip(target.value));
	}

	function performLookup(): void {
		lookupAndApplyRent(zip, setZip, setZipStatus, setLocationName, applyRentToAllProfiles);
	}

	function handleZipBlur(): void {
		if (normalizeZip(zip).length === 5) performLookup();
	}

	return { handleZipBlur, handleZipChange, handleZipLookupClick: performLookup, locationName, zip, zipStatus };
}
