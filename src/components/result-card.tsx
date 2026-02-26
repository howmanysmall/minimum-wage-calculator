import React from "react";
import { cn } from "../lib/utils";

interface ResultCardProperties {
	readonly emphasis?: boolean;
	readonly ghost?: boolean;
	readonly label: string;
	readonly value: string;
}

export function ResultCard({ emphasis = false, ghost = false, label, value }: ResultCardProperties): React.ReactNode {
	return (
		<article
			className={cn(
				"rounded-xl border border-border/62 bg-background/44 p-4 shadow-[0_18px_34px_-28px_rgba(0,0,0,0.98)]",
				emphasis && "border-primary/52 bg-primary/20 shadow-[0_24px_38px_-24px_rgba(40,73,130,0.72)]",
				ghost && "border-dashed bg-background/30 shadow-none",
			)}
		>
			<p
				className={cn(
					"text-xs font-semibold tracking-[0.03em] text-muted-foreground uppercase",
					emphasis && "text-primary-foreground/75",
				)}
			>
				{label}
			</p>
			<p
				className={cn(
					"mt-2 text-2xl leading-tight font-semibold [font-variant-numeric:tabular-nums] sm:text-[1.72rem]",
					emphasis && "text-primary-foreground",
					ghost && "text-muted-foreground",
					!emphasis && !ghost && "text-foreground",
				)}
			>
				{value}
			</p>
		</article>
	);
}
