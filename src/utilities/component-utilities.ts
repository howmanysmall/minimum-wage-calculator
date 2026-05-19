import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ReadonlyArray<ClassValue>): string {
	return twMerge(clsx(inputs));
}
