import type {
  RecipeDefinition,
  SlotStyles,
  StyleValue,
} from "@cocso-ui/recipe";
import {
  FONT_WEIGHT_MAP,
  isColorToken,
  isCompoundBorder,
} from "@cocso-ui/recipe/utils";
import { categoryOf } from "@cocso-ui/recipe/utils/property-categories";
import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";

const data = tokenData as FigmaTokenData;
const tokenMap = new Map(data.tokens.map((t) => [t.name, t]));

export interface FigmaNodeSpec {
  _tokenRefs?: Record<string, string>;
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
  iconRight?: number;
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

export interface FigmaResolveOptions {
  state?: string;
}

type MutableSpec = Record<string, unknown>;

export function resolveColorToken(name: string): RGB {
  const fullName = name.startsWith("color/") ? name : `color/${name}`;
  const token = tokenMap.get(fullName);
  if (token && typeof token.values.default === "object") {
    const c = token.values.default as FigmaColorValue;
    return { r: c.r, g: c.g, b: c.b };
  }
  console.warn(
    `[cocso-ui/figma] Unknown color token: "${name}". Falling back to magenta.`
  );
  return { r: 1, g: 0, b: 1 };
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
    const value = RADIUS_MAP[match[1]];
    if (value === undefined) {
      console.warn(
        `[cocso-ui/figma] Unknown radius token: "${name}". RADIUS_MAP covers 1-6 only. Falling back to 0.`
      );
      return 0;
    }
    return value;
  }
  console.warn(
    `[cocso-ui/figma] Unknown radius token: "${name}". Falling back to 0.`
  );
  return 0;
}

function applyStyleValue(
  spec: MutableSpec,
  key: string,
  value: StyleValue,
  tokenRefs: Record<string, string>
): void {
  if (isCompoundBorder(value)) {
    spec.strokeColor = resolveColorToken(value.color);
    spec.strokeWeight = value.width;
    tokenRefs.strokeColor = value.color;
    Reflect.deleteProperty(tokenRefs, "strokeWeight");
    return;
  }

  if (typeof value === "number") {
    spec[key] = value;
    Reflect.deleteProperty(tokenRefs, key);
    return;
  }

  if (typeof value === "string") {
    applyStringValue(spec, key, value, tokenRefs);
  }
}

function applyStringValue(
  spec: MutableSpec,
  key: string,
  value: string,
  tokenRefs: Record<string, string>
): void {
  const category = categoryOf(key);

  if (category === "radius") {
    applyRadiusValue(spec, key, value, tokenRefs);
    return;
  }

  if (category === "color") {
    if (
      value === "transparent" ||
      value === "currentColor" ||
      value === "none" ||
      value === "inherit"
    ) {
      Reflect.deleteProperty(tokenRefs, key);
      return;
    }
    if (isColorToken(value)) {
      spec[key] = resolveColorToken(value);
      tokenRefs[key] = value;
      return;
    }
    spec[key] = value;
    Reflect.deleteProperty(tokenRefs, key);
    return;
  }

  if (
    value === "transparent" ||
    value === "currentColor" ||
    value === "none" ||
    value === "inherit"
  ) {
    return;
  }

  if (key === "fontWeight" && value in FONT_WEIGHT_MAP) {
    spec[key] = FONT_WEIGHT_MAP[value as keyof typeof FONT_WEIGHT_MAP];
    return;
  }

  spec[key] = value;
}

function applyRadiusValue(
  spec: MutableSpec,
  key: string,
  value: string,
  tokenRefs: Record<string, string>
): void {
  if (value === "100%") {
    spec[key] = 1000;
    Reflect.deleteProperty(tokenRefs, key);
  } else if (value.startsWith("radius-")) {
    spec[key] = resolveRadiusToken(value);
    tokenRefs[key] = value;
  }
}

function applySlotStyles(
  spec: MutableSpec,
  slotStyles: SlotStyles,
  tokenRefs: Record<string, string>
): void {
  for (const [key, value] of Object.entries(slotStyles)) {
    applyStyleValue(spec, key, value, tokenRefs);
  }
}

function applyVariantStyles<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  spec: MutableSpec,
  recipe: RecipeDefinition<V, S>,
  merged: Record<string, unknown>,
  tokenRefs: Record<string, string>
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
        applySlotStyles(spec, slotStyles, tokenRefs);
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
  merged: Record<string, unknown>,
  tokenRefs: Record<string, string>
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
          applySlotStyles(spec, slotStyles, tokenRefs);
        }
      }
    }
  }
}

function applyBaseStyles<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  spec: MutableSpec,
  recipe: RecipeDefinition<V, S>,
  tokenRefs: Record<string, string>
): void {
  if (!recipe.base) {
    return;
  }
  for (const slot of recipe.slots) {
    const slotStyles = recipe.base[slot];
    if (slotStyles) {
      applySlotStyles(spec, slotStyles, tokenRefs);
    }
  }
}

function applyStateOverrides<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  spec: MutableSpec,
  recipe: RecipeDefinition<V, S>,
  merged: Record<string, unknown>,
  state: string,
  tokenRefs: Record<string, string>
): void {
  const stateMap = recipe.states?.[state];
  if (!stateMap) {
    return;
  }
  for (const [dimension, variantValue] of Object.entries(merged)) {
    const dimensionMap = (
      stateMap as Record<
        string,
        Record<string, Partial<Record<string, SlotStyles>>> | undefined
      >
    )[dimension];
    if (!dimensionMap) {
      continue;
    }
    const stateStyles = dimensionMap[variantValue as string];
    if (!stateStyles) {
      continue;
    }
    for (const slot of recipe.slots) {
      const slotStyles = (stateStyles as Record<string, SlotStyles>)[slot];
      if (slotStyles) {
        applySlotStyles(spec, slotStyles, tokenRefs);
      }
    }
  }
}

function normalizeLayoutProps(spec: MutableSpec): void {
  if (typeof spec.padding === "string") {
    const parts = (spec.padding as string).match(/(\d+(?:\.\d+)?)/g);
    if (parts) {
      const values = parts.map(Number);
      if (values.length >= 2) {
        spec.paddingTop = values[0];
        spec.paddingBottom = values[0];
        spec.paddingLeft = values[1];
        spec.paddingRight = values[1];
      } else if (values.length === 1) {
        spec.paddingTop = values[0];
        spec.paddingBottom = values[0];
        spec.paddingLeft = values[0];
        spec.paddingRight = values[0];
      }
    }
    spec.padding = undefined;
  }

  if (typeof spec.paddingX === "number") {
    if (spec.paddingLeft == null) {
      spec.paddingLeft = spec.paddingX;
    }
    if (spec.paddingRight == null) {
      spec.paddingRight = spec.paddingX;
    }
    spec.paddingX = undefined;
  }
}

/**
 * Resolve a recipe + variant selection into a flat Figma node spec.
 *
 * Applies styles in priority order: base → variant styles → compound variants → state overrides.
 * Compound variants win on conflict (matching the React resolver behavior).
 * When `options.state` is set, state-specific overrides are applied on top.
 *
 * The returned spec includes `_tokenRefs` mapping each resolved property key
 * to its original design token name (e.g., `{ bgColor: "primary-950" }`).
 */
export function resolveForFigma<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  variants: { [K in keyof V]?: keyof V[K] },
  options?: FigmaResolveOptions
): FigmaNodeSpec {
  const spec: MutableSpec = {};
  const tokenRefs: Record<string, string> = {};
  const merged = { ...recipe.defaultVariants, ...variants } as Record<
    string,
    unknown
  >;

  applyBaseStyles(spec, recipe, tokenRefs);
  applyVariantStyles(spec, recipe, merged, tokenRefs);
  applyCompoundVariants(spec, recipe, merged, tokenRefs);

  if (options?.state) {
    applyStateOverrides(spec, recipe, merged, options.state, tokenRefs);
  }

  normalizeLayoutProps(spec);

  if (Object.keys(tokenRefs).length > 0) {
    spec._tokenRefs = Object.freeze(tokenRefs);
  }

  return spec as FigmaNodeSpec;
}
