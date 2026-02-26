import React from "react";
import { formatCurrency, roundToTwo } from "../lib/format";
import type { WageResult } from "../types";
import { ResultCard } from "./result-card";

export interface ResultsGridProperties {
	readonly result: WageResult;
}

export function ResultsGrid({ result }: ResultsGridProperties): React.ReactNode {
	return (
		<div className="result-grid">
			<ResultCard
				label="Required Hourly Wage"
				value={`${formatCurrency(roundToTwo(result.hourlyRequired))} / hr`}
			/>
			<ResultCard
				label="Required Monthly Gross"
				value={formatCurrency(roundToTwo(result.monthlyGrossRequired))}
			/>
			<ResultCard label="Required Annual Gross" value={formatCurrency(roundToTwo(result.annualGrossRequired))} />
			<ResultCard label="Monthly Budget (B_r)" value={formatCurrency(roundToTwo(result.monthlyBudget))} />
		</div>
	);
}
