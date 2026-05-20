import React from "react";

import { HouseholdControls } from "./household-controls";
import { ProfileTabs } from "./profile-tabs";

import type { ProfileSectionProperties } from "./section-types";

const PROFILE_KICKER = <p className="section-kicker">Household Setup</p>;
const PROFILE_TITLE = <h2 className="text-foreground mb-3 text-xl font-semibold tracking-tight">Profile</h2>;
const SINGLE_ADULT_FOOD_NOTE = (
	<p className="text-muted-foreground mt-3 text-sm">Single Adult mode uses USDA baseline food assumptions.</p>
);

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
		<section className="section-shell">
			{PROFILE_KICKER}
			{PROFILE_TITLE}
			<ProfileTabs
				activeTab={activeTab}
				onHouseholdTabClick={onHouseholdTabClick}
				onSingleTabClick={onSingleTabClick}
			/>
			{activeTab === "single" ? SINGLE_ADULT_FOOD_NOTE : ""}
			{activeTab === "household" && (
				<div className="mt-3">
					<HouseholdControls
						householdFoodRecommendation={householdFoodRecommendation}
						householdProfile={householdProfile}
						onAdultsChange={onAdultsChange}
						onApplyHouseholdFoodRecommendation={onApplyHouseholdFoodRecommendation}
						onChildrenChange={onChildrenChange}
						onFoodPlanTierChange={onFoodPlanTierChange}
					/>
				</div>
			)}
		</section>
	);
}
