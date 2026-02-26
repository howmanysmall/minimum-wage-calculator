import React from "react";

export function AppHeader(): React.ReactNode {
	return (
		<header className="hero">
			<p className="eyebrow">Editorial Finance Calculator</p>
			<h1>Minimum Wage Calculator</h1>
			<p className="hero-copy">
				Estimate the hourly wage needed to cover local costs while accounting for savings and retirement goals.
			</p>
			<p className="formula-lede">
				Formula: <span className="mono">W_min,r = (B_r * (1 + s + k)) / H</span>
			</p>
		</header>
	);
}
