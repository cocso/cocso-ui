/**
 * Link recipe conformance test.
 *
 * Verifies that the React component's style functions produce output
 * consistent with the recipe's resolved values. If this test fails,
 * either the recipe or the React style functions need to be updated.
 *
 * Recipe is authoritative — update React to match the recipe.
 */
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import { getColor, getColorHover, type LinkVariant } from "../link.styles";

const VARIANTS: LinkVariant[] = ["inline", "current", "plain"];

describe("Link recipe conformance", () => {
  describe("variant → color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} color matches`, () => {
        const resolved = resolveForReact(linkRecipe, { variant });
        const react = getColor(variant);
        expect(resolved["--cocso-link-color"]).toBe(react);
      });
    }
  });

  describe("hover state → color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} hover color matches`, () => {
        const resolved = resolveForReact(
          linkRecipe,
          { variant },
          { state: "hover" }
        );
        const react = getColorHover(variant);
        expect(resolved["--cocso-link-color"]).toBe(react);
      });
    }
  });
});
