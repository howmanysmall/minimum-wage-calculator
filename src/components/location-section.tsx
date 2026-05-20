import React from "react";
import { cn } from "@utilities/component-utilities";

import { LocationZipRow } from "./location-zip-row";

import type { LocationSectionProperties } from "./section-types";

const LOCATION_KICKER = <p className="section-kicker">Region</p>;
const LOCATION_TITLE = <h2 className="text-foreground mb-3 text-xl font-semibold tracking-tight">Location</h2>;

export function LocationSection({
	locationName,
	onZipBlur,
	onZipChange,
	onZipLookupClick,
	zip,
	zipStatus,
}: LocationSectionProperties): React.ReactNode {
	return (
		<section className="section-shell">
			{LOCATION_KICKER}
			{LOCATION_TITLE}
			<LocationZipRow
				onZipBlur={onZipBlur}
				onZipChange={onZipChange}
				onZipLookupClick={onZipLookupClick}
				zip={zip}
			/>
			{locationName ? (
				<p className="border-primary/28 bg-primary/12 text-foreground mt-3 rounded-lg border px-3 py-2 text-sm font-medium">
					Area: {locationName}
				</p>
			) : (
				""
			)}
			{zipStatus ? (
				<p
					aria-live="polite"
					className={cn(
						"mt-2 rounded-lg bg-muted/56 px-3 py-2 text-sm",
						!locationName && "text-muted-foreground",
					)}>
					{zipStatus}
				</p>
			) : (
				""
			)}
		</section>
	);
}
