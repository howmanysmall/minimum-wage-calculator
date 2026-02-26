import React from "react";

interface FormulaDetailsProperties {
	readonly budgetLine: string;
	readonly wageLine: string;
}

export function FormulaDetails({ budgetLine, wageLine }: FormulaDetailsProperties): React.ReactNode {
	return (
		<details className="formula">
			<summary>How this was calculated</summary>
			<div className="formula-content">
				<p className="mono">{budgetLine}</p>
				<p className="mono">{wageLine}</p>
			</div>
		</details>
	);
}
