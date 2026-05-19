import React, { useState } from "react";
import {
	DEFAULT_ANNUAL_WORK_HOURS,
	DEFAULT_RETIREMENT_RATE_PERCENT,
	DEFAULT_SAVINGS_RATE_PERCENT,
} from "@constants/calculator-constants";

import type { ChangeEventHandler } from "react";

function normalizePercent(rawValue: string): number {
	const parsedValue = Number(rawValue);
	return Number.isFinite(parsedValue) ? Math.max(0, Math.min(100, parsedValue)) : 0;
}

function normalizeHours(rawValue: string): number {
	const parsedValue = Number(rawValue);
	return Number.isFinite(parsedValue) ? Math.max(1, parsedValue) : 1;
}

export interface AssumptionsState {
	readonly annualWorkHours: number;
	readonly handleRetirementRateChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleSavingsRateChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleWorkHoursChange: ChangeEventHandler<HTMLInputElement>;
	readonly retirementRatePercent: number;
	readonly savingsRatePercent: number;
}

export function useAssumptionsState(): AssumptionsState {
	const [annualWorkHours, setAnnualWorkHours] = useState(DEFAULT_ANNUAL_WORK_HOURS);
	const [retirementRatePercent, setRetirementRatePercent] = useState(DEFAULT_RETIREMENT_RATE_PERCENT);
	const [savingsRatePercent, setSavingsRatePercent] = useState(DEFAULT_SAVINGS_RATE_PERCENT);

	function handleSavingsRateChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
		setSavingsRatePercent(normalizePercent(target.value));
	}

	function handleRetirementRateChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
		setRetirementRatePercent(normalizePercent(target.value));
	}

	function handleWorkHoursChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
		setAnnualWorkHours(normalizeHours(target.value));
	}

	return {
		annualWorkHours,
		handleRetirementRateChange,
		handleSavingsRateChange,
		handleWorkHoursChange,
		retirementRatePercent,
		savingsRatePercent,
	};
}
