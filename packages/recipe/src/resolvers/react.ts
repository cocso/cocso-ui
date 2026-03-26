import type {
  FontWeightRef,
  RecipeDefinition,
  SlotStyles,
  StyleValue,
} from "../types";
import {
  CSS_LITERALS,
  FONT_WEIGHT_MAP,
  isColorToken,
  isComponentRef,
  isCompoundBorder,
} from "../utils/token-classification";

// ---------------------------------------------------------------------------
// Single value resolution
// ---------------------------------------------------------------------------

/**
 * Resolve a single StyleValue to a CSS string.
 */
export function resolveStyleValue(value: StyleValue): string {
  if (typeof value === "number") {
    return `${value}px`;
  }
  if (isCompoundBorder(value)) {
    return `${value.width}px ${value.style} var(--cocso-color-${value.color})`;
  }
  if (isComponentRef(value)) {
    return value.variant;
  }
  return resolveStringValue(value as string);
}

function resolveStringValue(value: string): string {
  if (CSS_LITERALS.has(value)) {
    return value;
  }
  if (value in FONT_WEIGHT_MAP) {
    return String(FONT_WEIGHT_MAP[value as FontWeightRef]);
  }
  if (isColorToken(value)) {
    return `var(--cocso-color-${value})`;
  }
  if (value.startsWith("radius-") || value.startsWith("spacing-")) {
    return `var(--cocso-${value})`;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Internal helpers for applying styles
// ---------------------------------------------------------------------------

function applySlotStyles(
  result: Record<string, string>,
  prefix: string,
  slots: readonly string[],
  slotMap: Partial<Record<string, SlotStyles>>
): void {
  for (const slot of slots) {
    const styles = slotMap[slot];
    if (!styles) {
      continue;
    }
    for (const [prop, value] of Object.entries(styles)) {
      result[`${prefix}-${prop}`] = resolveStyleValue(value);
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

interface ResolveOptions {
  state?: string;
}

/**
 * Resolve a recipe + variant selection into a CSS custom property map.
 */
export function resolveForReact<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  variants: { [K in keyof V]?: keyof V[K] },
  options?: ResolveOptions
): Record<string, string> {
  const result: Record<string, string> = {};
  const prefix = `--cocso-${recipe.name}`;
  const merged = { ...recipe.defaultVariants, ...variants } as {
    [K in keyof V]: keyof V[K];
  };

  // 1. Base styles
  if (recipe.base) {
    applySlotStyles(result, prefix, recipe.slots, recipe.base);
  }

  // 2. Variant styles
  applyVariantStyles(result, prefix, recipe, merged);

  // 3. Compound variants
  applyCompoundVariants(result, prefix, recipe, merged);

  // 4. State overrides
  if (options?.state) {
    applyStateOverrides(result, prefix, recipe, merged, options.state);
  }

  return result;
}

function applyVariantStyles<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  result: Record<string, string>,
  prefix: string,
  recipe: RecipeDefinition<V, S>,
  merged: { [K in keyof V]: keyof V[K] }
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
    applySlotStyles(
      result,
      prefix,
      recipe.slots,
      variantStyles as Partial<Record<string, SlotStyles>>
    );
  }
}

function applyCompoundVariants<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  result: Record<string, string>,
  prefix: string,
  recipe: RecipeDefinition<V, S>,
  merged: { [K in keyof V]: keyof V[K] }
): void {
  if (!recipe.compoundVariants) {
    return;
  }
  for (const cv of recipe.compoundVariants) {
    const matches = Object.entries(cv.conditions).every(([key, condition]) => {
      const selected = merged[key as keyof V];
      if (Array.isArray(condition)) {
        return (condition as string[]).includes(selected as string);
      }
      return selected === condition;
    });
    if (matches) {
      applySlotStyles(result, prefix, recipe.slots, cv.styles);
    }
  }
}

function applyStateOverrides<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  result: Record<string, string>,
  prefix: string,
  recipe: RecipeDefinition<V, S>,
  merged: { [K in keyof V]: keyof V[K] },
  state: string
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
    applySlotStyles(
      result,
      prefix,
      recipe.slots,
      stateStyles as Partial<Record<string, SlotStyles>>
    );
  }
}
