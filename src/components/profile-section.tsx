import React from "react";
import { HouseholdControls } from "./household-controls";
import { ProfileTabs } from "./profile-tabs";
import type { ProfileSectionProperties } from "./section-types";

export function ProfileSection({
	activeTab,
	householdFoodRecommendation,
	householdProfile,
	onAdultsChange,
	onApplyHouseholdFoodRecommendation,
	onChildrenChange,
	onFoodPlanTierChange,
	onHouseholdTabClick,
	onSingleTabClick,
}: ProfileSectionProperties): React.ReactNode {
	return (
		<section className="section">
			<h2>Profile</h2>
			<ProfileTabs
				activeTab={activeTab}
				onHouseholdTabClick={onHouseholdTabClick}
				onSingleTabClick={onSingleTabClick}
			/>
			{activeTab === "household" && (
				<HouseholdControls
					householdFoodRecommendation={householdFoodRecommendation}
					householdProfile={householdProfile}
					onAdultsChange={onAdultsChange}
					onApplyHouseholdFoodRecommendation={onApplyHouseholdFoodRecommendation}
					onChildrenChange={onChildrenChange}
					onFoodPlanTierChange={onFoodPlanTierChange}
				/>
			)}
		</section>
	);
}
