import React from "react";

interface ResultCardProperties {
	readonly emphasis?: boolean;
	readonly ghost?: boolean;
	readonly label: string;
	readonly value: string;
}

export function ResultCard({ emphasis = false, ghost = false, label, value }: ResultCardProperties): React.ReactNode {
	let className = "result-card";
	if (emphasis) className = `${className} emphasis`;
	if (ghost) className = `${className} ghost`;
	return (
		<article className={className}>
			<p className="result-label">{label}</p>
			<p className="result-value">{value}</p>
		</article>
	);
}
