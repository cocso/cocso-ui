/**
 * Select recipe conformance test.
 *
 * Verifies that the React component's style functions produce output
 * consistent with the recipe's resolved values. If this test fails,
 * either the recipe or the React style functions need to be updated.
 *
 * Recipe is authoritative — update React to match the recipe.
 */
import { describe, expect, it } from "vitest";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { type SelectSize, getStyles } from "../select.styles";

const SIZES: SelectSize[] = ["large", "medium", "small", "x-small"];

describe("Select recipe conformance", () => {
  describe("size → dimensions", () => {
    for (const size of SIZES) {
      it(`${size} height/paddingLeft/paddingRight/fontSize/borderRadius match`, () => {
        const resolved = resolveForReact(selectRecipe, { size });
        const react = getStyles(size);

        expect(resolved["--cocso-select-height"]).toBe(
          react["--cocso-select-height"]
        );
        expect(resolved["--cocso-select-paddingLeft"]).toBe(
          react["--cocso-select-padding-left"]
        );
        expect(resolved["--cocso-select-paddingRight"]).toBe(
          react["--cocso-select-padding-right"]
        );
        expect(resolved["--cocso-select-fontSize"]).toBe(
          react["--cocso-select-font-size"]
        );
        expect(resolved["--cocso-select-borderRadius"]).toBe(
          react["--cocso-select-border-radius"]
        );
      });
    }
  });
});
