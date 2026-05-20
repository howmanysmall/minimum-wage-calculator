import React from "react";

export interface FormulaDetailsProperties {
	readonly budgetLine: string;
	readonly wageLine: string;
}

const CALCULATION_SUMMARY = (
	<summary className="text-foreground cursor-pointer py-3 text-sm font-semibold">How This Was Calculated</summary>
);

export function FormulaDetails({ budgetLine, wageLine }: FormulaDetailsProperties): React.ReactNode {
	return (
		<details className="border-border/82 bg-muted/36 rounded-xl border px-4">
			{CALCULATION_SUMMARY}
			<div className="space-y-2 pb-3">
				<p className="border-border/70 bg-card/80 text-foreground rounded-md border px-3 py-2 font-mono text-xs leading-relaxed wrap-break-word">
					{budgetLine}
				</p>
				<p className="border-border/70 bg-card/80 text-foreground rounded-md border px-3 py-2 font-mono text-xs leading-relaxed wrap-break-word">
					{wageLine}
				</p>
			</div>
		</details>
	);
}
