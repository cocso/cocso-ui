/**
 * Inline Type Sync Test
 *
 * Verifies that inline type aliases in React components match the variant keys
 * defined in recipe definitions. AGENTS.md prohibits re-exporting from codegen,
 * so React components must declare inline type aliases — this test catches drift.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";

const REACT_SRC = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "react",
  "src",
  "components",
);

/**
 * Extract union members from an inline type alias declaration.
 * Matches patterns like: export type Foo = "a" | "b" | "c";
 */
function extractUnionMembers(source: string, typeName: string): string[] {
  const pattern = new RegExp(
    `export\\s+type\\s+${typeName}\\s*=\\s*([^;]+);`,
    "s",
  );
  const match = source.match(pattern);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]).sort();
}

function recipeVariantKeys(
  // biome-ignore lint/suspicious/noExplicitAny: recipe generic variance
  recipe: { variants: Record<string, Record<string, any>> },
  dimension: string,
): string[] {
  return Object.keys(recipe.variants[dimension] ?? {}).sort();
}

describe("Inline type sync — React ↔ Recipe", () => {
  const spinnerSrc = readFileSync(
    join(REACT_SRC, "spinner", "spinner.tsx"),
    "utf-8",
  );
  const radioSrc = readFileSync(
    join(REACT_SRC, "radio-group", "radio-group.tsx"),
    "utf-8",
  );

  it("SpinnerVariant matches spinnerRecipe.variants.variant", () => {
    const inline = extractUnionMembers(spinnerSrc, "SpinnerVariant");
    const recipe = recipeVariantKeys(spinnerRecipe, "variant");
    expect(inline).toEqual(recipe);
  });

  it("SpinnerSize matches spinnerRecipe.variants.size", () => {
    const inline = extractUnionMembers(spinnerSrc, "SpinnerSize");
    const recipe = recipeVariantKeys(spinnerRecipe, "size");
    expect(inline).toEqual(recipe);
  });

  it("RadioSize matches radioGroupRecipe.variants.size", () => {
    const inline = extractUnionMembers(radioSrc, "RadioSize");
    const recipe = recipeVariantKeys(radioGroupRecipe, "size");
    expect(inline).toEqual(recipe);
  });
});
