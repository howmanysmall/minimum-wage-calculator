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
		<section className="section">
			<h2>Core Assumptions</h2>
			<div className="input-grid three-up">
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
