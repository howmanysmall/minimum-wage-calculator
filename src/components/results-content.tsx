import React from "react";
import { formatCurrency, formatPercentFromDecimal, roundToTwo } from "../lib/format";
import type { WageResult } from "../types";
import { FormulaDetails } from "./formula-details";
import { ResultsGrid } from "./results-grid";

interface ResultsContentProperties {
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

function buildLiveSummary(result: WageResult): string {
	return `Updated hourly wage target ${formatCurrency(roundToTwo(result.hourlyRequired))} per hour.`;
}

export function ResultsContent({
	annualWorkHours,
	result,
	retirementRatePercent,
	savingsRatePercent,
}: ResultsContentProperties): React.ReactNode {
	return (
		<aside className="panel result-panel ready">
			<p aria-live="polite" className="sr-only">
				{buildLiveSummary(result)}
			</p>
			<h2>Results</h2>
			<p className="result-kicker">Calculated from your current assumptions and monthly costs.</p>
			<ResultsGrid result={result} />
			<FormulaDetails
				budgetLine={buildBudgetLine(result)}
				wageLine={buildWageLine(result, savingsRatePercent, retirementRatePercent, annualWorkHours)}
			/>
		</aside>
	);
}
