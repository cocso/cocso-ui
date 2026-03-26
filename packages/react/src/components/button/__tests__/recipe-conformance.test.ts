/**
 * Button recipe conformance test.
 *
 * Verifies that the React component's style functions produce output
 * consistent with the recipe's resolved values. If this test fails,
 * either the recipe or the React style functions need to be updated.
 *
 * Recipe is authoritative — update React to match the recipe.
 */

import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import {
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  getBackgroundColor,
  getBackgroundColorActive,
  getBackgroundColorHover,
  getBorder,
  getBorderRadius,
  getColor,
  getSizeStyles,
} from "../button.styles";

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "success",
  "error",
  "warning",
  "info",
];
const SIZES: ButtonSize[] = ["large", "medium", "small", "x-small"];
const SHAPES: ButtonShape[] = ["square", "circle", "rounded"];

describe("Button recipe conformance", () => {
  describe("variant → background color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} bgColor matches`, () => {
        const resolved = resolveForReact(buttonRecipe, {
          variant,
          size: "medium",
          shape: "square",
        });
        const react = getBackgroundColor(variant);
        expect(resolved["--cocso-button-bgColor"]).toBe(react);
      });
    }
  });

  describe("variant → text color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} fontColor matches`, () => {
        const resolved = resolveForReact(buttonRecipe, {
          variant,
          size: "medium",
          shape: "square",
        });
        const react = getColor(variant);
        expect(resolved["--cocso-button-fontColor"]).toBe(react);
      });
    }
  });

  describe("variant → border", () => {
    for (const variant of VARIANTS) {
      it(`${variant} border matches`, () => {
        const resolved = resolveForReact(buttonRecipe, {
          variant,
          size: "medium",
          shape: "square",
        });
        const react = getBorder(variant);
        const recipeBorder = resolved["--cocso-button-border"] ?? "none";
        expect(recipeBorder).toBe(react);
      });
    }
  });

  describe("size → dimensions", () => {
    for (const size of SIZES) {
      it(`${size} height/padding/fontSize match`, () => {
        const resolved = resolveForReact(buttonRecipe, {
          variant: "primary",
          size,
          shape: "square",
        });
        const react = getSizeStyles(size);

        expect(resolved["--cocso-button-height"]).toBe(
          react["--cocso-button-height"]
        );
        expect(resolved["--cocso-button-paddingInline"]).toBe(
          react["--cocso-button-padding-inline"]
        );
        expect(resolved["--cocso-button-fontSize"]).toBe(
          react["--cocso-button-font-size"]
        );
      });
    }
  });

  describe("shape × size → borderRadius", () => {
    for (const shape of SHAPES) {
      for (const size of SIZES) {
        it(`${shape}/${size} borderRadius matches`, () => {
          const resolved = resolveForReact(buttonRecipe, {
            variant: "primary",
            size,
            shape,
          });
          const react = getBorderRadius(shape, size);
          expect(resolved["--cocso-button-borderRadius"]).toBe(react);
        });
      }
    }
  });

  describe("hover state", () => {
    for (const variant of VARIANTS) {
      it(`${variant} hover bgColor matches`, () => {
        const resolved = resolveForReact(
          buttonRecipe,
          { variant, size: "medium", shape: "square" },
          { state: "hover" }
        );
        const react = getBackgroundColorHover(variant);
        expect(resolved["--cocso-button-bgColor"]).toBe(react);
      });
    }
  });

  describe("active state", () => {
    for (const variant of VARIANTS) {
      it(`${variant} active bgColor matches`, () => {
        const resolved = resolveForReact(
          buttonRecipe,
          { variant, size: "medium", shape: "square" },
          { state: "active" }
        );
        const react = getBackgroundColorActive(variant);
        expect(resolved["--cocso-button-bgColor"]).toBe(react);
      });
    }
  });
});
