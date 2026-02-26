import React from "react";

export interface ResultCardProperties {
	readonly label: string;
	readonly value: string;
}

export function ResultCard({ label, value }: ResultCardProperties): React.ReactNode {
	return (
		<article>
			<p className="result-label">{label}</p>
			<p className="result-value">{value}</p>
		</article>
	);
}
