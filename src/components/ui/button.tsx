import type { MouseEventHandler, ReactNode } from "react";
import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "lg";

interface ButtonProperties {
	readonly children: ReactNode;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly onClick?: MouseEventHandler<HTMLButtonElement>;
	readonly size?: ButtonSize;
	readonly type?: "button" | "submit" | "reset";
	readonly variant?: ButtonVariant;
}

function getSizeClassName(size: ButtonSize): string {
	if (size === "lg") return "h-11 px-5 text-sm";
	return "h-10 px-4 text-sm";
}

function getVariantClassName(variant: ButtonVariant): string {
	if (variant === "secondary") {
		return "border-border/70 bg-secondary/84 text-secondary-foreground hover:bg-secondary";
	}

	if (variant === "outline") {
		return "border-border/80 bg-background/55 text-foreground hover:bg-accent hover:text-accent-foreground";
	}

	if (variant === "ghost") {
		return "bg-transparent text-muted-foreground hover:bg-accent/68 hover:text-foreground";
	}

	return "border-primary/40 bg-primary text-primary-foreground hover:bg-primary/93 shadow-[0_20px_30px_-18px_rgba(56,89,150,0.72)]";
}

export function Button({
	children,
	className,
	disabled = false,
	onClick,
	size = "default",
	type = "button",
	variant = "default",
}: ButtonProperties): ReactNode {
	const resolvedButtonType = type === "submit" || type === "reset" ? type : "button";
	const buttonClassName = cn(
		"inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform]",
		"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
		"disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
		getSizeClassName(size),
		getVariantClassName(variant),
		className,
	);

	if (resolvedButtonType === "submit") {
		return (
			<button className={buttonClassName} disabled={disabled} onClick={onClick} type="submit">
				{children}
			</button>
		);
	}

	if (resolvedButtonType === "reset") {
		return (
			<button className={buttonClassName} disabled={disabled} onClick={onClick} type="reset">
				{children}
			</button>
		);
	}

	return (
		<button className={buttonClassName} disabled={disabled} onClick={onClick} type="button">
			{children}
		</button>
	);
}
