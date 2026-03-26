import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import {
  type BadgeShape,
  type BadgeSize,
  type BadgeVariant,
  getBackgroundColor,
  getBorder,
  getBorderRadius,
  getFontColor,
  getFontSize,
  getPadding,
} from "../badge.styles";

const VARIANTS: BadgeVariant[] = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "outline",
];
const SIZES: BadgeSize[] = ["large", "medium", "small"];
const SHAPES: BadgeShape[] = ["square", "circle", "rounded"];

describe("Badge recipe conformance", () => {
  describe("variant → background color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} bgColor matches`, () => {
        const resolved = resolveForReact(badgeRecipe, {
          variant,
          size: "medium",
          shape: "square",
        });
        expect(resolved["--cocso-badge-bgColor"]).toBe(
          getBackgroundColor(variant)
        );
      });
    }
  });

  describe("variant → font color", () => {
    for (const variant of VARIANTS) {
      it(`${variant} fontColor matches`, () => {
        const resolved = resolveForReact(badgeRecipe, {
          variant,
          size: "medium",
          shape: "square",
        });
        expect(resolved["--cocso-badge-fontColor"]).toBe(getFontColor(variant));
      });
    }
  });

  describe("variant → border", () => {
    for (const variant of VARIANTS) {
      it(`${variant} border matches`, () => {
        const resolved = resolveForReact(badgeRecipe, {
          variant,
          size: "medium",
          shape: "square",
        });
        const recipeBorder = resolved["--cocso-badge-border"] ?? "none";
        expect(recipeBorder).toBe(getBorder(variant));
      });
    }
  });

  describe("size → padding + fontSize", () => {
    for (const size of SIZES) {
      it(`${size} padding matches`, () => {
        const resolved = resolveForReact(badgeRecipe, {
          variant: "primary",
          size,
          shape: "square",
        });
        expect(resolved["--cocso-badge-padding"]).toBe(getPadding(size));
      });

      it(`${size} fontSize matches`, () => {
        const resolved = resolveForReact(badgeRecipe, {
          variant: "primary",
          size,
          shape: "square",
        });
        expect(resolved["--cocso-badge-fontSize"]).toBe(
          `${getFontSize(size)}px`
        );
      });
    }
  });

  describe("shape × size → borderRadius", () => {
    for (const shape of SHAPES) {
      for (const size of SIZES) {
        it(`${shape}/${size} borderRadius matches`, () => {
          const resolved = resolveForReact(badgeRecipe, {
            variant: "primary",
            size,
            shape,
          });
          expect(resolved["--cocso-badge-borderRadius"]).toBe(
            getBorderRadius(shape, size)
          );
        });
      }
    }
  });
});
