/**
 * Utility Functions Module
 * Contains common utility functions used throughout the application
 */

// clsx - for conditionally combining classNames
import { clsx, type ClassValue } from "clsx";

// tailwind-merge - for merging Tailwind CSS classes intelligently
import { twMerge } from "tailwind-merge";

/**
 * cn (className) Function
 * 
 * Combines multiple className values and intelligently merges Tailwind classes.
 * This function:
 * 1. Uses clsx to conditionally include classes based on truthiness
 * 2. Uses twMerge to resolve conflicting Tailwind utility classes
 * 
 * Example:
 * cn('px-2 py-1', 'px-4') // Returns 'py-1 px-4' (px-4 overrides px-2)
 * 
 * @param inputs - Array of class values (strings, objects, or arrays)
 * @returns Merged and deduplicated className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
