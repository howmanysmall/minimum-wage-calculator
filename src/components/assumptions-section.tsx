import React from "react";
import { NumericInput } from "./numeric-input";
import type { AssumptionsSectionProperties } from "./section-types";

export function AssumptionsSection({
	annualWorkHours,
	onRetirementRateChange,
	onSavingsRateChange,
	onWorkHoursChange,
	retirementRatePct,
	savingsRatePct,
}: AssumptionsSectionProperties): React.ReactNode {
	return (
		<section className="section-shell">
			<p className="section-kicker">Parameters</p>
			<h2 className="text-foreground mb-3 text-xl font-semibold tracking-tight">Core Assumptions</h2>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<NumericInput
					inputId="savings-rate"
					label="Savings % (s)"
					max={100}
					min={0}
					onChange={onSavingsRateChange}
					step="0.1"
					value={savingsRatePct}
				/>
				<NumericInput
					inputId="retirement-rate"
					label="Retirement % (k)"
					max={100}
					min={0}
					onChange={onRetirementRateChange}
					step="0.1"
					value={retirementRatePct}
				/>
				<NumericInput
					inputId="work-hours"
					label="Annual Hours (H)"
					min={1}
					onChange={onWorkHoursChange}
					step="1"
					value={annualWorkHours}
				/>
			</div>
		</section>
	);
}
