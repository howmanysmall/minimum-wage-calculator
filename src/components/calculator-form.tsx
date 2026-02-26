import React from "react";
import type { VersionSnapshot } from "../types";
import { CalculatorSections } from "./calculator-sections";
import type {
	AssumptionsSectionProperties,
	LocationSectionProperties,
	MonthlyCostsSectionProperties,
	ProfileSectionProperties,
} from "./section-types";

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
	return (
		<form className="panel form-panel" onSubmit={onFormSubmit}>
			<CalculatorSections
				assumptionsSectionProperties={assumptionsSectionProperties}
				locationSectionProperties={locationSectionProperties}
				monthlyCostsSectionProperties={monthlyCostsSectionProperties}
				profileSectionProperties={profileSectionProperties}
			/>
			{resultError ? (
				<p aria-live="polite" className="status error" role="alert">
					{resultError}
				</p>
			) : undefined}
			<button className="primary" type="submit">
				Calculate Required Wage
			</button>
			<p className="footnote">
				Data as of: {dataVersion.rentAsOf} (rent), {dataVersion.foodAsOf} (food).
			</p>
		</form>
	);
}
