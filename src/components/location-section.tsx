import React from "react";
import { LocationZipRow } from "./location-zip-row";
import type { LocationSectionProperties } from "./section-types";

export function LocationSection({
	locationName,
	onZipBlur,
	onZipChange,
	onZipLookupClick,
	zip,
	zipStatus,
}: LocationSectionProperties): React.ReactNode {
	return (
		<section className="section">
			<h2>Location</h2>
			<LocationZipRow
				onZipBlur={onZipBlur}
				onZipChange={onZipChange}
				onZipLookupClick={onZipLookupClick}
				zip={zip}
			/>
			{locationName ? <p className="status ok">Area: {locationName}</p> : undefined}
			{zipStatus ? (
				<p aria-live="polite" className="status">
					{zipStatus}
				</p>
			) : undefined}
		</section>
	);
}
