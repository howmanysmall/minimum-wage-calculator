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
	readonly onFormSubmit: React.EventHandler<React.SubmitEvent<HTMLFormElement>>;
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
		<main
			className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] lg:items-start"
			id="calculator-main"
		>
			<div className="rise-in min-w-0 [animation-delay:110ms]">
				<CalculatorForm
					assumptionsSectionProperties={assumptionsSectionProperties}
					dataVersion={dataVersion}
					locationSectionProperties={locationSectionProperties}
					monthlyCostsSectionProperties={monthlyCostsSectionProperties}
					onFormSubmit={onFormSubmit}
					profileSectionProperties={profileSectionProperties}
					resultError={resultError}
				/>
			</div>
			<div className="rise-in min-w-0 [animation-delay:190ms] lg:sticky lg:top-5">
				<ResultsPanel
					annualWorkHours={annualWorkHours}
					result={result}
					retirementRatePercent={retirementRatePct}
					savingsRatePercent={savingsRatePct}
				/>
			</div>
		</main>
	);
}
