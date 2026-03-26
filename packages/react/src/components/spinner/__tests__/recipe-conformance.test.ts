import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import {
  getBladeColor,
  getSizeConfig,
  type SpinnerSize,
  type SpinnerVariant,
} from "../spinner.styles";

const VARIANTS: SpinnerVariant[] = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "white",
];
const SIZES: SpinnerSize[] = ["large", "medium", "small"];

describe("Spinner recipe conformance", () => {
  describe("variant → blade color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} bladeColor matches`, () => {
        const resolved = resolveForReact(spinnerRecipe, {
          variant,
          size: "medium",
        });
        expect(resolved["--cocso-spinner-bladeColor"]).toBe(
          getBladeColor(variant)
        );
      });
    }
  });

  describe("size → geometry", () => {
    for (const size of SIZES) {
      const getRecipeRoot = (s: SpinnerSize) =>
        spinnerRecipe.variants.size[s].root as unknown as Record<
          string,
          unknown
        >;

      it(`${size} blades matches`, () => {
        const recipeSize = getRecipeRoot(size);
        const reactSize = getSizeConfig(size);
        expect(recipeSize.blades).toBe(reactSize.blades);
      });

      it(`${size} bladeWidth matches`, () => {
        const recipeSize = getRecipeRoot(size);
        const reactSize = getSizeConfig(size);
        expect(recipeSize.bladeWidth).toBe(reactSize.width);
      });

      it(`${size} bladeHeight matches`, () => {
        const recipeSize = getRecipeRoot(size);
        const reactSize = getSizeConfig(size);
        expect(recipeSize.bladeHeight).toBe(reactSize.height);
      });

      it(`${size} bladeRadius matches`, () => {
        const recipeSize = getRecipeRoot(size);
        const reactSize = getSizeConfig(size);
        expect(recipeSize.bladeRadius).toBe(reactSize.radius);
      });

      it(`${size} output matches`, () => {
        const recipeSize = getRecipeRoot(size);
        const reactSize = getSizeConfig(size);
        expect(recipeSize.output).toBe(reactSize.output);
      });
    }
  });
});
