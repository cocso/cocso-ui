import type { PropertyCategory } from "../types";

/**
 * Explicit property key → category overrides.
 * Properties not listed here fall back to name-based heuristic inference.
 *
 * When adding a new recipe property whose name does NOT contain "color" or "radius",
 * register it here so that resolvers interpret its value correctly.
 */
const PROPERTY_CATEGORIES: Record<string, PropertyCategory> = {
  // Color properties (value should be resolved as a color token)
  bgColor: "color",
  fontColor: "color",
  bladeColor: "color",
  borderColor: "color",
  fillColor: "color",
  checkedBgColor: "color",
  checkedThumbColor: "color",
  switchBgColor: "color",
  // Radius properties (value should be resolved as a radius token)
  borderRadius: "radius",
  bladeRadius: "radius",
};

/**
 * Determine the semantic category of a recipe style property by its key name.
 *
 * Resolution order:
 * 1. Explicit map lookup (PROPERTY_CATEGORIES)
 * 2. Heuristic: key contains "color" (case-insensitive) → "color"
 * 3. Heuristic: key contains "radius" (case-insensitive) → "radius"
 * 4. Fallback: "unknown"
 */
export function categoryOf(key: string): PropertyCategory {
  if (Object.hasOwn(PROPERTY_CATEGORIES, key)) {
    return PROPERTY_CATEGORIES[key];
  }

  const lower = key.toLowerCase();
  if (lower.includes("color")) {
    return "color";
  }
  if (lower.includes("radius")) {
    return "radius";
  }

  return "unknown";
}
