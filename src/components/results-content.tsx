import React from "react";
import { formatCurrency, formatPercentFromDecimal, roundToTwo } from "../lib/format";
import type { WageResult } from "../types";
import { FormulaDetails } from "./formula-details";
import { ResultsGrid } from "./results-grid";

export interface ResultsContentProperties {
	readonly annualWorkHours: number;
	readonly result: WageResult;
	readonly retirementRatePercent: number;
	readonly savingsRatePercent: number;
}

function buildBudgetLine(result: WageResult): string {
	return `B_r = H_r + F_p + T_t + I_p + U_p + M_p = ${formatCurrency(roundToTwo(result.monthlyBudget))}`;
}

function buildWageLine(
	result: WageResult,
	savingsRatePct: number,
	retirementRatePct: number,
	annualWorkHours: number,
): string {
	const budgetValue = formatCurrency(roundToTwo(result.monthlyBudget));
	const savingsValue = formatPercentFromDecimal(savingsRatePct / 100);
	const retirementValue = formatPercentFromDecimal(retirementRatePct / 100);
	return `W_min,r = (B_r * (1 + s + k)) / H = (${budgetValue} * (1 + ${savingsValue} + ${retirementValue})) / ${annualWorkHours}`;
}

export function ResultsContent({
	annualWorkHours,
	result,
	retirementRatePercent,
	savingsRatePercent,
}: ResultsContentProperties): React.ReactNode {
	return (
		<aside className="panel result-panel ready">
			<h2>Results</h2>
			<ResultsGrid result={result} />
			<FormulaDetails
				budgetLine={buildBudgetLine(result)}
				wageLine={buildWageLine(result, savingsRatePercent, retirementRatePercent, annualWorkHours)}
			/>
		</aside>
	);
}
