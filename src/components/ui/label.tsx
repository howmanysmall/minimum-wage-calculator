import React from "react";
import { cn } from "@utilities/component-utilities";

import type { ReactNode } from "react";

export interface LabelProperties {
	readonly children: ReactNode;
	readonly className?: string;
	readonly htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProperties): React.ReactNode {
	return (
		<label className={cn("text-sm leading-none font-medium", className)} htmlFor={htmlFor}>
			{children}
		</label>
	);
}
