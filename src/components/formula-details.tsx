import React from "react";

interface FormulaDetailsProperties {
	readonly budgetLine: string;
	readonly wageLine: string;
}

export function FormulaDetails({ budgetLine, wageLine }: FormulaDetailsProperties): React.ReactNode {
	return (
		<details className="formula">
			<summary className="formula-summary">How This Was Calculated</summary>
			<div className="formula-content">
				<p className="formula-line mono">{budgetLine}</p>
				<p className="formula-line mono">{wageLine}</p>
			</div>
		</details>
	);
}
