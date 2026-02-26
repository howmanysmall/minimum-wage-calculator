import React from "react";
import { AssumptionsSection } from "./assumptions-section";
import { LocationSection } from "./location-section";
import { MonthlyCostsSection } from "./monthly-costs-section";
import { ProfileSection } from "./profile-section";
import type {
	AssumptionsSectionProperties,
	LocationSectionProperties,
	MonthlyCostsSectionProperties,
	ProfileSectionProperties,
} from "./section-types";

export interface CalculatorSectionsProperties {
	readonly locationSectionProperties: LocationSectionProperties;
	readonly assumptionsSectionProperties: AssumptionsSectionProperties;
	readonly profileSectionProperties: ProfileSectionProperties;
	readonly monthlyCostsSectionProperties: MonthlyCostsSectionProperties;
}

interface LocationHandlerProperties {
	readonly handleZipBlur: LocationSectionProperties["onZipBlur"];
	readonly handleZipChange: LocationSectionProperties["onZipChange"];
	readonly handleZipLookupClick: LocationSectionProperties["onZipLookupClick"];
}

interface AssumptionHandlerProperties {
	readonly handleRetirementRateChange: AssumptionsSectionProperties["onRetirementRateChange"];
	readonly handleSavingsRateChange: AssumptionsSectionProperties["onSavingsRateChange"];
	readonly handleWorkHoursChange: AssumptionsSectionProperties["onWorkHoursChange"];
}

interface ProfileHandlerProperties {
	readonly handleAdultsChange: ProfileSectionProperties["onAdultsChange"];
	readonly handleApplyHouseholdFoodRecommendation: ProfileSectionProperties["onApplyHouseholdFoodRecommendation"];
	readonly handleChildrenChange: ProfileSectionProperties["onChildrenChange"];
	readonly handleFoodPlanTierChange: ProfileSectionProperties["onFoodPlanTierChange"];
	readonly handleHouseholdTabClick: ProfileSectionProperties["onHouseholdTabClick"];
	readonly handleSingleTabClick: ProfileSectionProperties["onSingleTabClick"];
}

function getLocationHandlers(locationSectionProperties: LocationSectionProperties): LocationHandlerProperties {
	return {
		handleZipBlur: locationSectionProperties.onZipBlur,
		handleZipChange: locationSectionProperties.onZipChange,
		handleZipLookupClick: locationSectionProperties.onZipLookupClick,
	};
}

function getAssumptionHandlers(
	assumptionsSectionProperties: AssumptionsSectionProperties,
): AssumptionHandlerProperties {
	return {
		handleRetirementRateChange: assumptionsSectionProperties.onRetirementRateChange,
		handleSavingsRateChange: assumptionsSectionProperties.onSavingsRateChange,
		handleWorkHoursChange: assumptionsSectionProperties.onWorkHoursChange,
	};
}

function getProfileHandlers(profileSectionProperties: ProfileSectionProperties): ProfileHandlerProperties {
	return {
		handleAdultsChange: profileSectionProperties.onAdultsChange,
		handleApplyHouseholdFoodRecommendation: profileSectionProperties.onApplyHouseholdFoodRecommendation,
		handleChildrenChange: profileSectionProperties.onChildrenChange,
		handleFoodPlanTierChange: profileSectionProperties.onFoodPlanTierChange,
		handleHouseholdTabClick: profileSectionProperties.onHouseholdTabClick,
		handleSingleTabClick: profileSectionProperties.onSingleTabClick,
	};
}

export function CalculatorSections({
	assumptionsSectionProperties,
	locationSectionProperties,
	monthlyCostsSectionProperties,
	profileSectionProperties,
}: CalculatorSectionsProperties): React.ReactNode {
	const locationHandlers = getLocationHandlers(locationSectionProperties);
	const assumptionHandlers = getAssumptionHandlers(assumptionsSectionProperties);
	const profileHandlers = getProfileHandlers(profileSectionProperties);
	const handleCostInputChange = monthlyCostsSectionProperties.onCostInputChange;

	return (
		<>
			<LocationSection
				locationName={locationSectionProperties.locationName}
				onZipBlur={locationHandlers.handleZipBlur}
				onZipChange={locationHandlers.handleZipChange}
				onZipLookupClick={locationHandlers.handleZipLookupClick}
				zip={locationSectionProperties.zip}
				zipStatus={locationSectionProperties.zipStatus}
			/>
			<AssumptionsSection
				annualWorkHours={assumptionsSectionProperties.annualWorkHours}
				onRetirementRateChange={assumptionHandlers.handleRetirementRateChange}
				onSavingsRateChange={assumptionHandlers.handleSavingsRateChange}
				onWorkHoursChange={assumptionHandlers.handleWorkHoursChange}
				retirementRatePct={assumptionsSectionProperties.retirementRatePct}
				savingsRatePct={assumptionsSectionProperties.savingsRatePct}
			/>
			<ProfileSection
				activeTab={profileSectionProperties.activeTab}
				householdFoodRecommendation={profileSectionProperties.householdFoodRecommendation}
				householdProfile={profileSectionProperties.householdProfile}
				onAdultsChange={profileHandlers.handleAdultsChange}
				onApplyHouseholdFoodRecommendation={profileHandlers.handleApplyHouseholdFoodRecommendation}
				onChildrenChange={profileHandlers.handleChildrenChange}
				onFoodPlanTierChange={profileHandlers.handleFoodPlanTierChange}
				onHouseholdTabClick={profileHandlers.handleHouseholdTabClick}
				onSingleTabClick={profileHandlers.handleSingleTabClick}
			/>
			<MonthlyCostsSection
				costs={monthlyCostsSectionProperties.costs}
				onCostInputChange={handleCostInputChange}
			/>
		</>
	);
}
