import React from "react";
import { AppHeader } from "./components/app-header";
import { CalculatorLayout } from "./components/calculator-layout";
import type {
	AssumptionsSectionProperties,
	LocationSectionProperties,
	MonthlyCostsSectionProperties,
	ProfileSectionProperties,
} from "./components/section-types";
import { useAssumptionsState } from "./hooks/use-assumptions-state";
import { useCostsState } from "./hooks/use-costs-state";
import { useLocationState } from "./hooks/use-location-state";
import { useProfileState } from "./hooks/use-profile-state";
import { useResultState } from "./hooks/use-result-state";
import { getDataVersion } from "./lib/data-lookup";

function createAssumptionsSectionProperties(
	assumptionsState: ReturnType<typeof useAssumptionsState>,
): AssumptionsSectionProperties {
	return {
		annualWorkHours: assumptionsState.annualWorkHours,
		onRetirementRateChange: assumptionsState.handleRetirementRateChange,
		onSavingsRateChange: assumptionsState.handleSavingsRateChange,
		onWorkHoursChange: assumptionsState.handleWorkHoursChange,
		retirementRatePct: assumptionsState.retirementRatePercent,
		savingsRatePct: assumptionsState.savingsRatePercent,
	};
}

function createLocationSectionProperties(
	locationState: ReturnType<typeof useLocationState>,
): LocationSectionProperties {
	return {
		locationName: locationState.locationName,
		onZipBlur: locationState.handleZipBlur,
		onZipChange: locationState.handleZipChange,
		onZipLookupClick: locationState.handleZipLookupClick,
		zip: locationState.zip,
		zipStatus: locationState.zipStatus,
	};
}

function createMonthlyCostsSectionProperties(
	costsState: ReturnType<typeof useCostsState>,
): MonthlyCostsSectionProperties {
	return {
		costs: costsState.currentCosts,
		onCostInputChange: costsState.handleCostInputChange,
	};
}

function createProfileSectionProperties(
	profileState: ReturnType<typeof useProfileState>,
	costsState: ReturnType<typeof useCostsState>,
): ProfileSectionProperties {
	return {
		activeTab: profileState.activeTab,
		householdFoodRecommendation: costsState.householdFoodRecommendation,
		householdProfile: profileState.householdProfile,
		onAdultsChange: profileState.handleAdultsChange,
		onApplyHouseholdFoodRecommendation: costsState.handleApplyHouseholdFoodRecommendation,
		onChildrenChange: profileState.handleChildrenChange,
		onFoodPlanTierChange: profileState.handleFoodPlanTierChange,
		onHouseholdTabClick: profileState.handleHouseholdTabClick,
		onSingleTabClick: profileState.handleSingleTabClick,
	};
}

export function App(): React.ReactNode {
	const dataVersion = getDataVersion();
	const assumptionsState = useAssumptionsState();
	const profileState = useProfileState();
	const costsState = useCostsState(profileState.activeTab, profileState.householdProfile);
	const locationState = useLocationState(costsState.applyRentToAllProfiles);
	const resultState = useResultState({
		annualWorkHours: assumptionsState.annualWorkHours,
		currentCosts: costsState.currentCosts,
		retirementRatePct: assumptionsState.retirementRatePercent,
		savingsRatePct: assumptionsState.savingsRatePercent,
		zip: locationState.zip,
	});
	const assumptionsSectionProperties = createAssumptionsSectionProperties(assumptionsState);
	const locationSectionProperties = createLocationSectionProperties(locationState);
	const monthlyCostsSectionProperties = createMonthlyCostsSectionProperties(costsState);
	const profileSectionProperties = createProfileSectionProperties(profileState, costsState);

	return (
		<div className="relative min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 lg:px-10">
			<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				<div className="bg-primary/16 absolute -top-44 left-1/5 h-[30rem] w-[30rem] rounded-full blur-[140px]" />
				<div className="absolute -top-8 -right-40 h-[28rem] w-[28rem] rounded-full bg-slate-400/10 blur-[136px]" />
				<div className="absolute -bottom-44 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-slate-600/10 blur-[140px]" />
			</div>
			<a
				className="bg-primary text-primary-foreground sr-only rounded-lg px-3 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
				href="#calculator-main"
			>
				Skip to calculator
			</a>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-7 pb-10 lg:gap-8">
				<AppHeader />
				<CalculatorLayout
					annualWorkHours={assumptionsState.annualWorkHours}
					assumptionsSectionProperties={assumptionsSectionProperties}
					dataVersion={dataVersion}
					locationSectionProperties={locationSectionProperties}
					monthlyCostsSectionProperties={monthlyCostsSectionProperties}
					onFormSubmit={resultState.handleFormSubmit}
					profileSectionProperties={profileSectionProperties}
					result={resultState.result}
					resultError={resultState.resultError}
					retirementRatePct={assumptionsState.retirementRatePercent}
					savingsRatePct={assumptionsState.savingsRatePercent}
				/>
			</div>
		</div>
	);
}
