import React from "react";

interface ResultsHintItemProperties {
	readonly text: string;
}

export function ResultsHintItem({ text }: ResultsHintItemProperties): React.ReactNode {
	return (
		<p className="text-muted-foreground relative pl-4 text-sm leading-relaxed">
			<span aria-hidden className="bg-primary/70 absolute top-[0.56em] left-0 h-1.5 w-1.5 rounded-full" />
			{text}
		</p>
	);
}
