import React from "react";
import type { VersionSnapshot } from "../types";
import { CalculatorSections } from "./calculator-sections";
import type {
	AssumptionsSectionProperties,
	LocationSectionProperties,
	MonthlyCostsSectionProperties,
	ProfileSectionProperties,
} from "./section-types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CalculatorFormProperties {
	readonly dataVersion: VersionSnapshot;
	readonly resultError: string;
	readonly onFormSubmit: React.FormEventHandler<HTMLFormElement>;
	readonly locationSectionProperties: LocationSectionProperties;
	readonly assumptionsSectionProperties: AssumptionsSectionProperties;
	readonly profileSectionProperties: ProfileSectionProperties;
	readonly monthlyCostsSectionProperties: MonthlyCostsSectionProperties;
}

export function CalculatorForm({
	assumptionsSectionProperties,
	dataVersion,
	locationSectionProperties,
	monthlyCostsSectionProperties,
	onFormSubmit,
	profileSectionProperties,
	resultError,
}: CalculatorFormProperties): React.ReactNode {
	const dataTimestamp = `Data as of: ${dataVersion.rentAsOf} (rent), ${dataVersion.foodAsOf} (food).`;

	return (
		<form onSubmit={onFormSubmit}>
			<Card className="space-y-5 rounded-3xl px-5 py-5 sm:px-6 sm:py-6">
				<p className="section-kicker">Model Inputs</p>
				<h2 className="text-foreground text-[1.32rem] font-semibold tracking-tight">Calculator Inputs</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">
					Set location, assumptions, profile, and monthly costs before calculating required wage.
				</p>
				<CalculatorSections
					assumptionsSectionProperties={assumptionsSectionProperties}
					locationSectionProperties={locationSectionProperties}
					monthlyCostsSectionProperties={monthlyCostsSectionProperties}
					profileSectionProperties={profileSectionProperties}
				/>
				{resultError ? (
					<p
						aria-live="polite"
						className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-3 py-2 text-sm font-medium"
						role="alert"
					>
						{resultError}
					</p>
				) : undefined}
				<Button className="h-11 w-full rounded-xl text-sm font-semibold" size="lg" type="submit">
					Calculate Required Wage
				</Button>
				<p className="text-muted-foreground text-xs leading-relaxed">{dataTimestamp}</p>
			</Card>
		</form>
	);
}
