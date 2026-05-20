import React from "react";

import { MonthlyCostsGrid } from "./monthly-costs-grid";

import type { MonthlyCostsSectionProperties } from "./section-types";

const MONTHLY_COSTS_KICKER = <p className="section-kicker">Budget Inputs</p>;
const MONTHLY_COSTS_TITLE = (
	<h2 className="text-foreground mb-3 text-xl font-semibold tracking-tight">Monthly Costs</h2>
);

export function MonthlyCostsSection({ costs, onCostInputChange }: MonthlyCostsSectionProperties): React.ReactNode {
	return (
		<section className="section-shell">
			{MONTHLY_COSTS_KICKER}
			{MONTHLY_COSTS_TITLE}
			<MonthlyCostsGrid costs={costs} onCostInputChange={onCostInputChange} />
		</section>
	);
}
