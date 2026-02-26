import React from "react";

interface ResultsHintItemProperties {
	readonly text: string;
}

export function ResultsHintItem({ text }: ResultsHintItemProperties): React.ReactNode {
	return <p className="results-hint-item">{text}</p>;
}
