import React from "react";
import type { WageResult } from "../types";
import { ResultsContent } from "./results-content";

export interface ResultsPanelProperties {
	readonly result: WageResult | undefined;
	readonly savingsRatePercent: number;
	readonly retirementRatePercent: number;
	readonly annualWorkHours: number;
}

export function ResultsPanel({
	annualWorkHours,
	result,
	retirementRatePercent,
	savingsRatePercent,
}: ResultsPanelProperties): React.ReactNode {
	if (!result) {
		return (
			<aside className="panel result-panel">
				<h2>Results</h2>
				<p className="placeholder">
					Enter a ZIP and monthly costs, then run the calculator to see required hourly, monthly, and annual
					income.
				</p>
			</aside>
		);
	}

	return (
		<ResultsContent
			annualWorkHours={annualWorkHours}
			result={result}
			retirementRatePercent={retirementRatePercent}
			savingsRatePercent={savingsRatePercent}
		/>
	);
}
