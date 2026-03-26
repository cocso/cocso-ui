/**
 * Input recipe conformance test.
 *
 * Verifies that the React component's style functions produce output
 * consistent with the recipe's resolved values. If this test fails,
 * either the recipe or the React style functions need to be updated.
 *
 * Recipe is authoritative — update React to match the recipe.
 */

import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import { getStyles, type InputSize } from "../input.styles";

const SIZES: InputSize[] = ["x-small", "small", "medium", "large"];

describe("Input recipe conformance", () => {
  describe("size → dimensions", () => {
    for (const size of SIZES) {
      it(`${size} height/paddingX/fontSize/borderRadius match`, () => {
        const resolved = resolveForReact(inputRecipe, { size });
        const react = getStyles(size);

        expect(resolved["--cocso-input-height"]).toBe(
          react["--cocso-input-height"]
        );
        expect(resolved["--cocso-input-paddingX"]).toBe(
          react["--cocso-input-padding-x"]
        );
        expect(resolved["--cocso-input-fontSize"]).toBe(
          react["--cocso-input-font-size"]
        );
        expect(resolved["--cocso-input-borderRadius"]).toBe(
          react["--cocso-input-border-radius"]
        );
      });
    }
  });
});
