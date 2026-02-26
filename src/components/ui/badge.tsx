import type { ReactNode } from "react";
import React from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

interface BadgeProperties {
	readonly children: ReactNode;
	readonly className?: string;
	readonly variant?: BadgeVariant;
}

function getVariantClassName(variant: BadgeVariant): string {
	if (variant === "secondary") return "bg-secondary/88 text-secondary-foreground";
	if (variant === "outline") return "border-border/80 bg-transparent text-foreground";
	return "bg-primary text-primary-foreground";
}

export function Badge({ children, className, variant = "default" }: BadgeProperties): ReactNode {
	return (
		<span
			className={cn(
				"inline-flex w-fit items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold",
				getVariantClassName(variant),
				className,
			)}
		>
			{children}
		</span>
	);
}
