import type {
  RecipeDefinition,
  SlotStyles,
  StyleValue,
} from "@cocso-ui/recipe";
import { isColorToken, isCompoundBorder } from "@cocso-ui/recipe/utils";
import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";

const data = tokenData as FigmaTokenData;
const tokenMap = new Map(data.tokens.map((t) => [t.name, t]));

export interface FigmaNodeSpec {
  bgColor?: RGB;
  bladeColor?: RGB;
  bladeHeight?: number;
  bladeRadius?: number;
  blades?: number;
  bladeWidth?: number;
  borderColor?: RGB;
  borderRadius?: number;
  borderStyle?: string;
  borderWidth?: number;
  checkedBgColor?: RGB;
  checkedThumbColor?: RGB;
  color?: RGB;
  contentPadding?: string;
  cornerRadius?: number;
  dotSize?: number;
  fillColor?: RGB;
  fills?: RGB;
  fontColor?: RGB;
  fontSize?: number;
  fontWeight?: number;
  height?: number;
  minWidth?: number;
  output?: number;
  padding?: number;
  paddingBottom?: number;
  paddingInline?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingX?: number;
  radius?: number;
  size?: number;
  strokeColor?: RGB;
  strokeWeight?: number;
  switchBgColor?: RGB;
  thumbOffset?: number;
  thumbSize?: number;
  width?: number;
}

type MutableSpec = Record<string, unknown>;

export function resolveColorToken(name: string): RGB {
  const fullName = name.startsWith("color/") ? name : `color/${name}`;
  const token = tokenMap.get(fullName);
  if (token && typeof token.values.default === "object") {
    const c = token.values.default as FigmaColorValue;
    return { r: c.r, g: c.g, b: c.b };
  }
  return { r: 0, g: 0, b: 0 };
}

const RADIUS_MAP: Record<string, number> = {
  "1": 2,
  "2": 4,
  "3": 6,
  "4": 8,
  "5": 12,
  "6": 16,
};

const RADIUS_TOKEN_RE = /^radius-(\d+)$/;

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

function applyStyleValue(
  spec: MutableSpec,
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

function applyStringValue(spec: MutableSpec, key: string, value: string): void {
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

  spec[key] = value;
}

function applyRadiusValue(spec: MutableSpec, key: string, value: string): void {
  if (value === "100%") {
    spec[key] = 1000;
  } else if (value.startsWith("radius-")) {
    spec[key] = resolveRadiusToken(value);
  }
}

function applySlotStyles(spec: MutableSpec, slotStyles: SlotStyles): void {
  for (const [key, value] of Object.entries(slotStyles)) {
    applyStyleValue(spec, key, value);
  }
}

function applyVariantStyles<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  spec: MutableSpec,
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
  spec: MutableSpec,
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
>(spec: MutableSpec, recipe: RecipeDefinition<V, S>): void {
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
  const spec: MutableSpec = {};
  const merged = { ...recipe.defaultVariants, ...variants } as Record<
    string,
    unknown
  >;

  applyBaseStyles(spec, recipe);
  applyVariantStyles(spec, recipe, merged);
  applyCompoundVariants(spec, recipe, merged);

  return spec as FigmaNodeSpec;
}
