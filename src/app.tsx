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
		<div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
			<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-28 -left-18 size-72 rounded-full bg-amber-300/40 blur-3xl sm:size-96" />
				<div className="absolute top-14 -right-18 size-72 rounded-full bg-teal-300/30 blur-3xl sm:size-96" />
			</div>
			<a
				className="sr-only rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
				href="#calculator-main"
			>
				Skip to calculator
			</a>
			<div className="mx-auto flex max-w-7xl flex-col gap-6">
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
