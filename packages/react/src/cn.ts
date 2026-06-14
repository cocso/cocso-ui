import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using `clsx` for conditional joining and
 * `tailwind-merge` to resolve Tailwind CSS class conflicts.
 *
 * @param inputs - Any number of class values (strings, arrays, objects).
 * @returns A single deduplicated, conflict-resolved class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
