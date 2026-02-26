import React from "react";
import type { VersionSnapshot, WageResult } from "../types";
import { CalculatorForm } from "./calculator-form";
import { ResultsPanel } from "./results-panel";
import type {
	AssumptionsSectionProperties,
	LocationSectionProperties,
	MonthlyCostsSectionProperties,
	ProfileSectionProperties,
} from "./section-types";

interface CalculatorLayoutProperties {
	readonly annualWorkHours: number;
	readonly dataVersion: VersionSnapshot;
	readonly result?: WageResult | undefined;
	readonly resultError: string;
	readonly retirementRatePct: number;
	readonly savingsRatePct: number;
	readonly locationSectionProperties: LocationSectionProperties;
	readonly assumptionsSectionProperties: AssumptionsSectionProperties;
	readonly profileSectionProperties: ProfileSectionProperties;
	readonly monthlyCostsSectionProperties: MonthlyCostsSectionProperties;
	readonly onFormSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function CalculatorLayout({
	annualWorkHours,
	assumptionsSectionProperties,
	dataVersion,
	locationSectionProperties,
	monthlyCostsSectionProperties,
	onFormSubmit,
	profileSectionProperties,
	result,
	resultError,
	retirementRatePct,
	savingsRatePct,
}: CalculatorLayoutProperties): React.ReactNode {
	return (
		<main className="layout" id="calculator-main">
			<CalculatorForm
				assumptionsSectionProperties={assumptionsSectionProperties}
				dataVersion={dataVersion}
				locationSectionProperties={locationSectionProperties}
				monthlyCostsSectionProperties={monthlyCostsSectionProperties}
				onFormSubmit={onFormSubmit}
				profileSectionProperties={profileSectionProperties}
				resultError={resultError}
			/>
			<ResultsPanel
				annualWorkHours={annualWorkHours}
				result={result}
				retirementRatePercent={retirementRatePct}
				savingsRatePercent={savingsRatePct}
			/>
		</main>
	);
}
