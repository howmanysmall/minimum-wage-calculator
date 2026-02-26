import React from "react";
import { Badge } from "./ui/badge";

export function AppHeader(): React.ReactNode {
	return (
		<header className="surface-panel-strong rise-in rounded-3xl px-5 py-6 sm:px-8 sm:py-9">
			<Badge
				className="border-border/80 bg-background/46 rounded-full px-3 py-1 font-semibold tracking-[0.055em] uppercase"
				variant="outline"
			>
				Regional Cost Model
			</Badge>
			<h1 className="text-foreground mt-5 max-w-4xl font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-[3.35rem]">
				Minimum Wage Calculator
			</h1>
			<p className="text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
				Estimate the hourly wage needed to cover local costs while accounting for savings and retirement goals.
			</p>
			<p className="text-muted-foreground mt-5 text-sm font-medium">
				Formula:{" "}
				<code className="text-foreground border-border/70 bg-background/45 rounded-lg border px-2.5 py-1 font-mono font-semibold">
					W_min,r = (B_r * (1 + s + k)) / H
				</code>
			</p>
		</header>
	);
}
