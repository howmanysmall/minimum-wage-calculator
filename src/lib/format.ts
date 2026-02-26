const usdFormatter = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
	style: "currency",
});

export function formatCurrency(value: number): string {
	return usdFormatter.format(value);
}

export function formatPercentFromDecimal(decimal: number): string {
	return `${(decimal * 100).toFixed(1)}%`;
}

export function roundToTwo(value: number): number {
	return Math.round(value * 100) / 100;
}
