import React from "react";
import type { TabId } from "../types";

interface ProfileTabsProperties {
	readonly activeTab: TabId;
	readonly onHouseholdTabClick: React.MouseEventHandler<HTMLButtonElement>;
	readonly onSingleTabClick: React.MouseEventHandler<HTMLButtonElement>;
}

export function ProfileTabs({
	activeTab,
	onHouseholdTabClick,
	onSingleTabClick,
}: ProfileTabsProperties): React.ReactNode {
	return (
		<div className="tabs">
			<button
				aria-pressed={activeTab === "single"}
				className={activeTab === "single" ? "tab active" : "tab"}
				onClick={onSingleTabClick}
				type="button"
			>
				Single Adult
			</button>
			<button
				aria-pressed={activeTab === "household"}
				className={activeTab === "household" ? "tab active" : "tab"}
				onClick={onHouseholdTabClick}
				type="button"
			>
				Household
			</button>
		</div>
	);
}
