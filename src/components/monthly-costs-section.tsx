import React from "react";
import { MonthlyCostsGrid } from "./monthly-costs-grid";
import type { MonthlyCostsSectionProperties } from "./section-types";

export function MonthlyCostsSection({ costs, onCostInputChange }: MonthlyCostsSectionProperties): React.ReactNode {
	return (
		<section className="section">
			<h2>Monthly Costs</h2>
			<MonthlyCostsGrid costs={costs} onCostInputChange={onCostInputChange} />
		</section>
	);
}
