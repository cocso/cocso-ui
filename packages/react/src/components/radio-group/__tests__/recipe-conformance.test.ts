/**
 * RadioGroup recipe conformance test.
 *
 * Verifies that the React component's sizeVars produce output
 * consistent with the recipe's resolved values. If this test fails,
 * either the recipe or the React sizeVars need to be updated.
 *
 * Recipe is authoritative — update React to match the recipe.
 */

import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import { type RadioSize, sizeVars } from "../radio-group.styles";

const SIZES: RadioSize[] = ["large", "medium", "small"];

describe("RadioGroup recipe conformance", () => {
  describe("size → radio size", () => {
    for (const size of SIZES) {
      it(`${size} --cocso-radio-size matches`, () => {
        const resolved = resolveForReact(radioGroupRecipe, { size });
        expect(resolved["--cocso-radio-size"]).toBe(
          sizeVars[size]["--cocso-radio-size" as keyof typeof sizeVars.large]
        );
      });
    }
  });

  describe("size → dot size", () => {
    for (const size of SIZES) {
      it(`${size} --cocso-radio-dotSize matches`, () => {
        const resolved = resolveForReact(radioGroupRecipe, { size });
        expect(resolved["--cocso-radio-dotSize"]).toBe(
          sizeVars[size][
            "--cocso-radio-dot-size" as keyof typeof sizeVars.large
          ]
        );
      });
    }
  });
});
