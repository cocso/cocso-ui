import type { RecipeDefinition, SlotStyles } from "./types";

// Minimal console type for environments without DOM lib.
declare const console: { warn(...args: unknown[]): void };

/**
 * defineRecipe — identity function that provides type inference and validation.
 *
 * The recipe is pure data: a declarative mapping of variant combinations to
 * style token references. It has no runtime behavior — resolvers interpret it.
 *
 * @example
 * ```ts
 * export const buttonRecipe = defineRecipe({
 *   name: "button",
 *   slots: ["root"] as const,
 *   variants: {
 *     variant: {
 *       primary: { root: { bgColor: "primary-950", textColor: "white" } },
 *     },
 *     size: {
 *       large: { root: { height: 40, paddingInline: 14 } },
 *     },
 *   },
 * });
 * ```
 */
export function defineRecipe<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  const S extends string,
>(recipe: RecipeDefinition<V, S>): RecipeDefinition<V, S> {
  const seen = new Map<string, string>();
  for (const [dimension, values] of Object.entries(recipe.variants)) {
    for (const valueName of Object.keys(values as Record<string, unknown>)) {
      const existing = seen.get(valueName);
      if (existing) {
        console.warn(
          `[recipe:${recipe.name}] Variant value "${valueName}" exists in both "${existing}" and "${dimension}" dimensions. ` +
            "Use dimension-aware state overrides to avoid ambiguity."
        );
      }
      seen.set(valueName, dimension);
    }
  }
  return recipe;
}
