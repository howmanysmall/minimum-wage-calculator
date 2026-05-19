import React from "react";
import { cn } from "@utilities/component-utilities";

import type { ReactNode } from "react";

export interface CardProperties {
	readonly children: ReactNode;
	readonly className?: string;
}

export function Card({ children, className }: CardProperties): React.ReactNode {
	return <div className={cn("surface-panel rounded-2xl text-card-foreground", className)}>{children}</div>;
}
