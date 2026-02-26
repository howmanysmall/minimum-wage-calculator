import React from "react";
import type { TabId } from "../types";
import { Button } from "./ui/button";

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
		<div className="border-border/65 bg-background/48 grid grid-cols-2 gap-2 rounded-xl border p-1.5">
			<Button
				className="h-10 rounded-lg font-semibold"
				onClick={onSingleTabClick}
				type="button"
				variant={activeTab === "single" ? "secondary" : "ghost"}
			>
				Single Adult
			</Button>
			<Button
				className="h-10 rounded-lg font-semibold"
				onClick={onHouseholdTabClick}
				type="button"
				variant={activeTab === "household" ? "secondary" : "ghost"}
			>
				Household
			</Button>
		</div>
	);
}
