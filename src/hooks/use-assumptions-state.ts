import type { ChangeEventHandler } from "react";
import { useCallback, useState } from "react";
import {
	DEFAULT_ANNUAL_WORK_HOURS,
	DEFAULT_RETIREMENT_RATE_PERCENT,
	DEFAULT_SAVINGS_RATE_PERCENT,
} from "../lib/calculator-constants";

function normalizePercent(rawValue: string): number {
	const parsedValue = Number(rawValue);
	if (!Number.isFinite(parsedValue)) return 0;
	return Math.max(0, Math.min(100, parsedValue));
}

function normalizeHours(rawValue: string): number {
	const parsedValue = Number(rawValue);
	if (!Number.isFinite(parsedValue)) return 1;
	return Math.max(1, parsedValue);
}

export interface AssumptionsState {
	readonly annualWorkHours: number;
	readonly retirementRatePercent: number;
	readonly savingsRatePercent: number;
	readonly handleRetirementRateChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleSavingsRateChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleWorkHoursChange: ChangeEventHandler<HTMLInputElement>;
}

export function useAssumptionsState(): AssumptionsState {
	const [annualWorkHours, setAnnualWorkHours] = useState(DEFAULT_ANNUAL_WORK_HOURS);
	const [retirementRatePercent, setRetirementRatePercent] = useState(DEFAULT_RETIREMENT_RATE_PERCENT);
	const [savingsRatePercent, setSavingsRatePercent] = useState(DEFAULT_SAVINGS_RATE_PERCENT);
	const handleSavingsRateChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		setSavingsRatePercent(normalizePercent(event.target.value));
	}, []);

	const handleRetirementRateChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		setRetirementRatePercent(normalizePercent(event.target.value));
	}, []);

	const handleWorkHoursChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		setAnnualWorkHours(normalizeHours(event.target.value));
	}, []);

	return {
		annualWorkHours,
		handleRetirementRateChange,
		handleSavingsRateChange,
		handleWorkHoursChange,
		retirementRatePercent,
		savingsRatePercent,
	};
}
