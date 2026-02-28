import type { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from "react";
import { useRef, useState } from "react";
import { isZipFormatValid, lookupZipRentAsync, normalizeZip, preloadZipRentSnapshotAsync } from "../lib/data-lookup";
import type { ZipRentRecord } from "../types";

async function lookupAndApplyRentAsync(
	zip: string,
	setZip: (value: string) => void,
	setZipStatus: (value: string) => void,
	setLocationName: (value: string) => void,
	applyRentToAllProfiles: (rentMonthly: number) => void,
	lookupRequestId: number,
	getCurrentLookupRequestId: () => number,
): Promise<void> {
	const normalizedZip = normalizeZip(zip);
	setZip(normalizedZip);
	if (!isZipFormatValid(normalizedZip)) {
		setZipStatus("Enter a valid 5-digit ZIP code.");
		setLocationName("");
		return;
	}

	setZipStatus("Loading HUD 2BR rent snapshot...");

	let rentRecord: ZipRentRecord | undefined;
	try {
		rentRecord = await lookupZipRentAsync(normalizedZip);
	} catch {
		if (lookupRequestId !== getCurrentLookupRequestId()) return;
		setZipStatus("Could not load rent snapshot. Try again.");
		setLocationName("");
		return;
	}
	if (lookupRequestId !== getCurrentLookupRequestId()) return;

	if (!rentRecord) {
		setZipStatus(`No rent snapshot match for ZIP ${normalizedZip}. Enter rent manually.`);
		setLocationName("");
		return;
	}

	setLocationName(rentRecord.hudAreaName);
	setZipStatus(`Loaded HUD 2BR rent snapshot for ZIP ${normalizedZip}.`);
	applyRentToAllProfiles(rentRecord.twoBedroom);
}

async function preloadZipRentSnapshotSafelyAsync(): Promise<void> {
	try {
		await preloadZipRentSnapshotAsync();
	} catch {
		// Snapshot preload failures are non-blocking.
	}
}

export interface LocationState {
	readonly handleZipBlur: FocusEventHandler<HTMLInputElement>;
	readonly handleZipChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleZipLookupClick: MouseEventHandler<HTMLButtonElement>;
	readonly locationName: string;
	readonly zip: string;
	readonly zipStatus: string;
}

export function useLocationState(applyRentToAllProfiles: (rentMonthly: number) => void): LocationState {
	const [locationName, setLocationName] = useState("");
	const [zip, setZip] = useState("");
	const [zipStatus, setZipStatus] = useState("");
	const lookupRequestIdRef = useRef(0);

	function startBackgroundPreload(): void {
		// oxlint-disable-next-line no-void
		void preloadZipRentSnapshotSafelyAsync();
	}

	function startBackgroundLookup(lookupRequestId: number): void {
		// oxlint-disable-next-line no-void
		void lookupAndApplyRentAsync(
			zip,
			setZip,
			setZipStatus,
			setLocationName,
			applyRentToAllProfiles,
			lookupRequestId,
			() => lookupRequestIdRef.current,
		);
	}

	function performLookup(): void {
		const lookupRequestId = lookupRequestIdRef.current + 1;
		lookupRequestIdRef.current = lookupRequestId;
		startBackgroundLookup(lookupRequestId);
	}

	function handleZipChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
		const normalizedZip = normalizeZip(target.value);
		setZip(normalizedZip);
		if (normalizedZip.length === 5) {
			startBackgroundPreload();
		}
	}

	function handleZipBlur(): void {
		if (normalizeZip(zip).length === 5) performLookup();
	}

	return { handleZipBlur, handleZipChange, handleZipLookupClick: performLookup, locationName, zip, zipStatus };
}
