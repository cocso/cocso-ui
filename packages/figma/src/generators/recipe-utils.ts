import type { RecipeDefinition, SlotStyles } from "@cocso-ui/recipe";
import { type FigmaNodeSpec, resolveForFigma } from "./recipe-resolver";

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

export function groupVariantsByFirstDimension<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  combinations: Record<string, string>[]
): Map<string, Array<{ name: string; spec: FigmaNodeSpec }>> {
  const dimensions = Object.keys(recipe.variants);
  const firstDim = dimensions[0];
  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();

  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(recipe, combo as Record<string, string>);
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
