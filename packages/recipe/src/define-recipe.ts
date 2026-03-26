import type { RecipeDefinition, SlotStyles } from "./types";

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
  return recipe;
}
