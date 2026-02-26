import React from "react";

export function AppHeader(): React.ReactNode {
	return (
		<header className="hero">
			<p className="eyebrow">Mobile-first calculator</p>
			<h1>Minimum Wage Calculator</h1>
			<p>
				Formula: <span className="mono">W_min,r = (B_r * (1 + s + k)) / H</span>
			</p>
		</header>
	);
}
