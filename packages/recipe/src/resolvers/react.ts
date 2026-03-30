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

// Minimal type declarations for environment-agnostic package.
declare const console: { warn(...args: unknown[]): void };

// Potential token reference pattern: hyphenated identifiers that look like
// misspelled color/radius/spacing tokens (e.g., "primay-950", "nutral-100").
// CSS keywords like "auto", "inline-flex", "pointer" do NOT match this.
const POTENTIAL_TOKEN_RE = /^[a-z]+-\d/;

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
  if (POTENTIAL_TOKEN_RE.test(value)) {
    console.warn(
      `[cocso-ui/recipe] Unrecognized style value: "${value}". ` +
        "Expected color token, radius, spacing, fontWeight, or CSS literal."
    );
  }
  return value;
}

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

  if (recipe.base) {
    applySlotStyles(result, prefix, recipe.slots, recipe.base);
  }

  applyVariantStyles(result, prefix, recipe, merged);
  applyCompoundVariants(result, prefix, recipe, merged);

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
