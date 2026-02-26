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
		<div aria-label="Profile tabs" className="tabs" role="tablist">
			<button
				aria-selected={activeTab === "single"}
				className={activeTab === "single" ? "tab active" : "tab"}
				onClick={onSingleTabClick}
				role="tab"
				type="button"
			>
				Single Adult
			</button>
			<button
				aria-selected={activeTab === "household"}
				className={activeTab === "household" ? "tab active" : "tab"}
				onClick={onHouseholdTabClick}
				role="tab"
				type="button"
			>
				Household
			</button>
		</div>
	);
}
