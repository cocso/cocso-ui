import type { RecipeDefinition, SlotStyles } from "../types";
import { resolveForReact } from "./react";

/** Convert camelCase to kebab-case: "bgColor" -> "bg-color" */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/** Transform all keys in a record from camelCase to kebab-case */
function toKebabKeys(map: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(map)) {
    result[camelToKebab(key)] = value;
  }
  return result;
}

/**
 * Get the set of CSS property keys that have explicit state overrides in the recipe.
 * This handles the edge case where a state value equals the base value
 * (e.g., link "current" variant where hover color === base color).
 */
function getExplicitStateKeys<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  merged: Record<string, string>,
  state: string
): Set<string> {
  const prefix = `--cocso-${recipe.name}`;
  const stateMap = recipe.states?.[state];
  if (!stateMap) {
    return new Set();
  }
  const keys = new Set<string>();
  for (const [dim, val] of Object.entries(merged)) {
    const dimMap = (
      stateMap as Record<
        string,
        Record<string, Partial<Record<string, SlotStyles>>> | undefined
      >
    )[dim];
    if (!dimMap) {
      continue;
    }
    const styles = dimMap[val];
    if (!styles) {
      continue;
    }
    for (const slot of recipe.slots) {
      const slotStyles = (styles as Record<string, SlotStyles | undefined>)[
        slot
      ];
      if (!slotStyles) {
        continue;
      }
      for (const prop of Object.keys(slotStyles)) {
        keys.add(`${prefix}-${prop}`);
      }
    }
  }
  return keys;
}

/**
 * Resolve a recipe + variant selection into a CSS style map ready for React consumption.
 *
 * Unlike `resolveForReact()`, this function:
 * - Outputs kebab-case CSS custom property names (e.g., `--cocso-button-bg-color`)
 * - Supports multi-state resolution with suffixed keys (e.g., `--cocso-button-bg-color-hover`)
 * - Only includes state-suffixed keys for properties explicitly overridden in the recipe's state map
 */
export function resolveStyleMap<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  variants: { [K in keyof V]?: keyof V[K] },
  options?: { states?: string[] }
): Record<string, string> {
  const merged = { ...recipe.defaultVariants, ...variants } as Record<
    string,
    string
  >;
  const base = resolveForReact(recipe, variants);
  const result = toKebabKeys(base);

  for (const state of options?.states ?? []) {
    const explicitKeys = getExplicitStateKeys(recipe, merged, state);
    if (explicitKeys.size === 0) {
      continue;
    }
    const stateResolved = resolveForReact(recipe, variants, { state });
    for (const key of explicitKeys) {
      if (key in stateResolved) {
        result[`${camelToKebab(key)}-${state}`] = stateResolved[key];
      }
    }
  }
  return result;
}
