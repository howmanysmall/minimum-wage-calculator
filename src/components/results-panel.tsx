import React from "react";
import type { WageResult } from "../types";
import { ResultCard } from "./result-card";
import { ResultsContent } from "./results-content";
import { ResultsHintItem } from "./results-hint-item";

interface ResultsPanelProperties {
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
			<aside className="panel result-panel empty">
				<h2>Results</h2>
				<p className="placeholder">
					Enter your ZIP and monthly costs, then calculate to generate hourly, monthly, and annual targets.
				</p>
				<div className="result-grid preview-grid">
					<ResultCard ghost label="Required Hourly Wage" value="-- / hr" />
					<ResultCard ghost label="Required Monthly Gross" value="--" />
				</div>
				<div className="results-hint-list">
					<ResultsHintItem text="Use ZIP Rent to auto-fill housing costs from HUD." />
					<ResultsHintItem text="Adjust savings and retirement assumptions before running the model." />
					<ResultsHintItem text="Switch between Single Adult and Household for food baseline differences." />
				</div>
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
