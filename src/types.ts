export type FoodPlanTier = "thrifty" | "low" | "moderate" | "liberal";
export type TabId = "single" | "household";

export interface MonthlyCosts {
	readonly rentMonthly: number;
	readonly foodMonthly: number;
	readonly transportMonthly: number;
	readonly internetPhoneMonthly: number;
	readonly utilitiesMonthly: number;
	readonly healthMonthly: number;
}

export interface CoreAssumptions {
	readonly savingsRate: number;
	readonly retirementRate: number;
	readonly annualWorkHours: number;
}

export interface WageInput extends MonthlyCosts, CoreAssumptions {}

export interface WageResult {
	readonly monthlyBudget: number;
	readonly monthlyGrossRequired: number;
	readonly annualGrossRequired: number;
	readonly hourlyRequired: number;
}

export interface HouseholdProfile {
	readonly adults: number;
	readonly children: number;
	readonly foodPlanTier: FoodPlanTier;
}

export interface ZipRentRecord {
	readonly zip: string;
	readonly hudAreaCode: string;
	readonly hudAreaName: string;
	readonly twoBedroom: number;
	readonly sourceYear: number;
}

export interface RentSnapshot {
	readonly sourceYear: number;
	readonly sourceUrl: string;
	readonly generatedAt: string;
	readonly recordCount: number;
	readonly records: Array<ZipRentRecord>;
}

export interface FoodSnapshot {
	readonly sourceYear: number;
	readonly sourceMonth: string;
	readonly sourceUrl: string;
	readonly notes: string;
	readonly singleAdult: Record<FoodPlanTier, number>;
	readonly adultPerPerson: Record<FoodPlanTier, number>;
	readonly childPerPerson: Record<FoodPlanTier, number>;
}

export interface VersionSnapshot {
	readonly rentAsOf: string;
	readonly foodAsOf: string;
	readonly appBuiltAt: string;
}
