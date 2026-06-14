import type { RecipeDefinition, SlotStyles } from "@cocso-ui/recipe";
import { type FigmaNodeSpec, resolveForFigma } from "./recipe-resolver";

/**
 * Pre-resolved Figma JSON data loaded from codegen output.
 */
export interface FigmaJSONData {
  combinations: Record<
    string,
    FigmaNodeSpec & { states?: Record<string, FigmaNodeSpec> }
  >;
  name: string;
  slots: string[];
}

export function getAllVariantCombinations<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(recipe: RecipeDefinition<V, S>): Record<string, string>[] {
  const dimensions = Object.keys(recipe.variants) as (keyof V & string)[];
  if (dimensions.length === 0) {
    return [{}];
  }

  const entries = dimensions.map((dim) => ({
    dim,
    values: Object.keys(recipe.variants[dim]),
  }));

  let combinations: Record<string, string>[] = [{}];
  for (const { dim, values } of entries) {
    const next: Record<string, string>[] = [];
    for (const combo of combinations) {
      for (const val of values) {
        next.push({ ...combo, [dim]: val });
      }
    }
    combinations = next;
  }
  return combinations;
}

/**
 * Build a combo key string matching the format used in .figma.json files.
 */
export function comboKey(combo: Record<string, string>): string {
  return Object.entries(combo)
    .map(([k, v]) => `${k}=${v}`)
    .join(",");
}

/**
 * Look up a pre-resolved FigmaNodeSpec from JSON data.
 * Falls back to resolveForFigma if not found (backward compatibility).
 */
export function lookupSpec<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  json: FigmaJSONData | undefined,
  recipe: RecipeDefinition<V, S>,
  combo: Record<string, string>,
  options?: { state?: string }
): FigmaNodeSpec {
  if (json) {
    const key = comboKey(combo);
    const entry = json.combinations[key];
    if (entry) {
      if (options?.state && entry.states) {
        return entry.states[options.state] ?? entry;
      }
      return entry;
    }
  }
  // Fallback to direct resolver
  return resolveForFigma(recipe, combo as Record<string, never>, options);
}

export function groupVariantsByFirstDimension<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  combinations: Record<string, string>[],
  json?: FigmaJSONData
): Map<string, Array<{ name: string; spec: FigmaNodeSpec }>> {
  const dimensions = Object.keys(recipe.variants);
  const firstDim = dimensions[0];
  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();

  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = lookupSpec(json, recipe, combo);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec });
  }

  return groups;
}
