import type { ReactNode } from "react";
import React from "react";
import { cn } from "../../lib/utils";

interface CardProperties {
	readonly children: ReactNode;
	readonly className?: string;
}

export function Card({ children, className }: CardProperties): React.ReactNode {
	return <div className={cn("surface-panel rounded-2xl text-card-foreground", className)}>{children}</div>;
}
