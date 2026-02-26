import type { ReactNode } from "react";
import React from "react";
import { cn } from "../../lib/utils";

interface LabelProperties {
	readonly children: ReactNode;
	readonly className?: string;
	readonly htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProperties): ReactNode {
	return (
		<label className={cn("text-sm leading-none font-medium", className)} htmlFor={htmlFor}>
			{children}
		</label>
	);
}
