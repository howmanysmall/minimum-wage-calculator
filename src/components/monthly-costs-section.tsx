import React from "react";
import { MonthlyCostsGrid } from "./monthly-costs-grid";
import type { MonthlyCostsSectionProperties } from "./section-types";

export function MonthlyCostsSection({ costs, onCostInputChange }: MonthlyCostsSectionProperties): React.ReactNode {
	return (
		<section className="section-shell">
			<p className="section-kicker">Budget Inputs</p>
			<h2 className="text-foreground mb-3 text-xl font-semibold tracking-tight">Monthly Costs</h2>
			<MonthlyCostsGrid costs={costs} onCostInputChange={onCostInputChange} />
		</section>
	);
}
