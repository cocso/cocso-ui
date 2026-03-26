/**
 * Figma resolver — maps a recipe + variant selection to Figma-compatible
 * node properties (RGB fills, pixel dimensions, corner radii, stroke weights).
 *
 * Lives in packages/figma/ (not packages/recipe/) because it depends on
 * tokens.json for color → RGB resolution and on Figma plugin type conventions.
 */

import type {
  CompoundBorder,
  RecipeDefinition,
  SlotStyles,
  StyleValue,
} from "@cocso-ui/recipe";
import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";

const data = tokenData as FigmaTokenData;
const tokenMap = new Map(data.tokens.map((t) => [t.name, t]));

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

/** Figma-compatible node specification produced by resolveForFigma(). */
export interface FigmaNodeSpec {
  bladeColor?: RGB;
  bladeHeight?: number;
  bladeRadius?: number;
  blades?: number;
  bladeWidth?: number;
  borderRadius?: number;
  cornerRadius?: number;
  fills?: RGB;
  fontSize?: number;
  fontWeight?: number;
  height?: number;
  output?: number;
  paddingBottom?: number;
  paddingInline?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  strokeColor?: RGB;
  strokeWeight?: number;
  width?: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Token classification helpers (mirrors react.ts logic)
// ---------------------------------------------------------------------------

const COLOR_PREFIXES = new Set([
  "neutral",
  "primary",
  "danger",
  "warning",
  "success",
  "info",
  "white",
  "black",
  "text",
]);

function isColorToken(value: string): boolean {
  if (value === "white" || value === "black" || value === "transparent") {
    return true;
  }
  const prefix = value.split("-")[0];
  return COLOR_PREFIXES.has(prefix ?? "");
}

function isCompoundBorder(value: unknown): value is CompoundBorder {
  return (
    typeof value === "object" &&
    value !== null &&
    "_type" in value &&
    (value as CompoundBorder)._type === "border"
  );
}

// ---------------------------------------------------------------------------
// Token resolution
// ---------------------------------------------------------------------------

/** Resolve a color token name like "primary-950" to an RGB value (0–1 range). */
export function resolveColorToken(name: string): RGB {
  const fullName = name.startsWith("color/") ? name : `color/${name}`;
  const token = tokenMap.get(fullName);
  if (token && typeof token.values.default === "object") {
    const c = token.values.default as FigmaColorValue;
    return { r: c.r, g: c.g, b: c.b };
  }
  return { r: 0, g: 0, b: 0 };
}

/**
 * Radius token map: "radius-N" → pixel value.
 * Matches the CSS custom property values defined in the baseframe YAML.
 */
const RADIUS_MAP: Record<string, number> = {
  "1": 2,
  "2": 4,
  "3": 6,
  "4": 8,
  "5": 12,
  "6": 16,
};

/** Pattern for numbered radius tokens e.g. "radius-4". */
const RADIUS_TOKEN_RE = /^radius-(\d+)$/;

/** Resolve a border-radius token name like "radius-4" to a pixel value. */
export function resolveRadiusToken(name: string): number {
  if (name === "radius-full") {
    return 1000;
  }
  const match = name.match(RADIUS_TOKEN_RE);
  if (match) {
    return RADIUS_MAP[match[1]] ?? 0;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Style value dispatch
// ---------------------------------------------------------------------------

/** Keys whose string values are color tokens. */
const COLOR_KEYS = new Set([
  "bgColor",
  "fontColor",
  "bladeColor",
  "borderColor",
  "fillColor",
]);

function isColorKey(key: string): boolean {
  return COLOR_KEYS.has(key) || key.toLowerCase().includes("color");
}

function isRadiusKey(key: string): boolean {
  return key === "borderRadius" || key.toLowerCase().includes("radius");
}

/**
 * Apply a single StyleValue entry from a slot to the accumulator spec.
 * Skips CSS-only values that have no Figma equivalent.
 */
function applyStyleValue(
  spec: FigmaNodeSpec,
  key: string,
  value: StyleValue
): void {
  if (isCompoundBorder(value)) {
    spec.strokeColor = resolveColorToken(value.color);
    spec.strokeWeight = value.width;
    return;
  }

  if (typeof value === "number") {
    spec[key] = value;
    return;
  }

  if (typeof value === "string") {
    applyStringValue(spec, key, value);
  }
}

function applyStringValue(
  spec: FigmaNodeSpec,
  key: string,
  value: string
): void {
  if (
    value === "transparent" ||
    value === "currentColor" ||
    value === "none" ||
    value === "inherit"
  ) {
    return;
  }

  if (isRadiusKey(key)) {
    applyRadiusValue(spec, key, value);
    return;
  }

  if (isColorKey(key) && isColorToken(value)) {
    spec[key] = resolveColorToken(value);
    return;
  }

  // Pass through non-color, non-radius string values as-is
  spec[key] = value;
}

function applyRadiusValue(
  spec: FigmaNodeSpec,
  key: string,
  value: string
): void {
  if (value === "100%") {
    spec[key] = 1000;
  } else if (value.startsWith("radius-")) {
    spec[key] = resolveRadiusToken(value);
  }
}

// ---------------------------------------------------------------------------
// Slot application helpers
// ---------------------------------------------------------------------------

function applySlotStyles(spec: FigmaNodeSpec, slotStyles: SlotStyles): void {
  for (const [key, value] of Object.entries(slotStyles)) {
    applyStyleValue(spec, key, value);
  }
}

function applyVariantStyles<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  spec: FigmaNodeSpec,
  recipe: RecipeDefinition<V, S>,
  merged: Record<string, unknown>
): void {
  for (const [dimension, variantValue] of Object.entries(merged)) {
    const dimensionDef = recipe.variants[dimension as keyof V];
    if (!dimensionDef) {
      continue;
    }
    const variantStyles = dimensionDef[variantValue as string];
    if (!variantStyles) {
      continue;
    }
    for (const slot of recipe.slots) {
      const slotStyles = (variantStyles as Record<string, SlotStyles>)[slot];
      if (slotStyles) {
        applySlotStyles(spec, slotStyles);
      }
    }
  }
}

function compoundConditionMatches(
  conditions: Record<string, string | string[] | undefined>,
  merged: Record<string, unknown>
): boolean {
  return Object.entries(conditions).every(([key, condition]) => {
    const selected = merged[key];
    if (Array.isArray(condition)) {
      return (condition as string[]).includes(selected as string);
    }
    return selected === condition;
  });
}

function applyCompoundVariants<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  spec: FigmaNodeSpec,
  recipe: RecipeDefinition<V, S>,
  merged: Record<string, unknown>
): void {
  if (!recipe.compoundVariants) {
    return;
  }
  for (const cv of recipe.compoundVariants) {
    if (
      compoundConditionMatches(
        cv.conditions as Record<string, string | string[] | undefined>,
        merged
      )
    ) {
      for (const slot of recipe.slots) {
        const slotStyles = cv.styles[slot];
        if (slotStyles) {
          applySlotStyles(spec, slotStyles);
        }
      }
    }
  }
}

function applyBaseStyles<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(spec: FigmaNodeSpec, recipe: RecipeDefinition<V, S>): void {
  if (!recipe.base) {
    return;
  }
  for (const slot of recipe.slots) {
    const slotStyles = recipe.base[slot];
    if (slotStyles) {
      applySlotStyles(spec, slotStyles);
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve a recipe + variant selection into a flat Figma node spec.
 *
 * Applies styles in priority order: base → variant styles → compound variants.
 * Compound variants win on conflict (matching the React resolver behavior).
 */
export function resolveForFigma<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  variants: { [K in keyof V]?: keyof V[K] }
): FigmaNodeSpec {
  const spec: FigmaNodeSpec = {};
  const merged = { ...recipe.defaultVariants, ...variants } as Record<
    string,
    unknown
  >;

  applyBaseStyles(spec, recipe);
  applyVariantStyles(spec, recipe, merged);
  applyCompoundVariants(spec, recipe, merged);

  return spec;
}
