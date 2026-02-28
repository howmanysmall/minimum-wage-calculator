import React, { useState } from "react";
import { calculateRequiredWage } from "../lib/calc";
import { isZipFormatValid, normalizeZip } from "../lib/data-lookup";
import type { MonthlyCosts, WageResult } from "../types";

interface CalculationInput {
	readonly annualWorkHours: number;
	readonly currentCosts: MonthlyCosts;
	readonly retirementRatePercent: number;
	readonly savingsRatePercent: number;
	readonly zip: string;
}

interface ResultState {
	readonly handleFormSubmit: React.EventHandler<React.SubmitEvent<HTMLFormElement>>;
	readonly result: WageResult | undefined;
	readonly resultError: string;
}

export function useResultState({
	annualWorkHours,
	currentCosts,
	retirementRatePercent,
	savingsRatePercent,
	zip,
}: CalculationInput): ResultState {
	const [result, setResult] = useState<WageResult | undefined>(undefined);
	const [resultError, setResultError] = useState("");

	function handleFormSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
		event.preventDefault();
		setResultError("");
		if (!isZipFormatValid(normalizeZip(zip))) {
			setResult(undefined);
			setResultError("ZIP code is required and must be 5 digits.");
			return;
		}

		try {
			const computedResult = calculateRequiredWage({
				...currentCosts,
				annualWorkHours: annualWorkHours,
				retirementRate: retirementRatePercent / 100,
				savingsRate: savingsRatePercent / 100,
			});
			setResult(computedResult);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to calculate required wage.";
			setResult(undefined);
			setResultError(message);
		}
	}

	return { handleFormSubmit, result, resultError };
}
