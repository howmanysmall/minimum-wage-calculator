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
		<div className="app-shell">
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
	);
}
