import React from "react";
import type { WageResult } from "../types";
import { ResultCard } from "./result-card";
import { ResultsContent } from "./results-content";
import { ResultsHintItem } from "./results-hint-item";
import { Card } from "./ui/card";

interface ResultsPanelProperties {
	readonly annualWorkHours: number;
	readonly result: WageResult | undefined;
	readonly retirementRatePercent: number;
	readonly savingsRatePercent: number;
}

export function ResultsPanel({
	annualWorkHours,
	result,
	retirementRatePercent,
	savingsRatePercent,
}: ResultsPanelProperties): React.ReactNode {
	if (!result) {
		return (
			<aside>
				<Card className="space-y-4 rounded-3xl px-5 py-5 sm:px-6 sm:py-6">
					<p className="section-kicker">Output</p>
					<h2 className="text-foreground text-2xl tracking-tight">Results</h2>
					<p className="text-muted-foreground text-sm leading-relaxed">
						Enter your ZIP and monthly costs, then calculate to generate hourly, monthly, and annual
						targets.
					</p>
					<ResultCard ghost label="Required Hourly Wage" value="-- / hr" />
					<ResultCard ghost label="Required Monthly Gross" value="--" />
					<ResultsHintItem text="Use ZIP Rent to auto-fill housing costs from HUD." />
					<ResultsHintItem text="Adjust savings and retirement assumptions before running the model." />
					<ResultsHintItem text="Switch between Single Adult and Household for food baseline differences." />
				</Card>
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
