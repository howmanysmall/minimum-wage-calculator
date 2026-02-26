import type { FormEventHandler } from "react";
import { useCallback, useState } from "react";
import { calculateRequiredWage } from "../lib/calc";
import { isZipFormatValid, normalizeZip } from "../lib/data-lookup";
import type { MonthlyCosts, WageResult } from "../types";

interface CalculationInput {
	readonly annualWorkHours: number;
	readonly currentCosts: MonthlyCosts;
	readonly retirementRatePct: number;
	readonly savingsRatePct: number;
	readonly zip: string;
}

export interface ResultState {
	readonly result: WageResult | undefined;
	readonly resultError: string;
	readonly handleFormSubmit: FormEventHandler<HTMLFormElement>;
}

export function useResultState({
	annualWorkHours,
	currentCosts,
	retirementRatePct,
	savingsRatePct,
	zip,
}: CalculationInput): ResultState {
	const [result, setResult] = useState<WageResult | undefined>(undefined);
	const [resultError, setResultError] = useState("");

	const handleFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
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
					retirementRate: retirementRatePct / 100,
					savingsRate: savingsRatePct / 100,
				});
				setResult(computedResult);
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unable to calculate required wage.";
				setResult(undefined);
				setResultError(message);
			}
		},
		[annualWorkHours, currentCosts, retirementRatePct, savingsRatePct, zip],
	);

	return { handleFormSubmit, result, resultError };
}
