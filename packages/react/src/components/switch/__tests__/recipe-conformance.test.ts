import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import type { SwitchSize, SwitchVariant } from "../switch.styles";
import {
  getCheckedColor,
  getSwitchHeight,
  getSwitchWidth,
  getThumbOffset,
  getThumbSize,
} from "../switch.styles";

const SIZES: SwitchSize[] = ["large", "medium", "small"];
const VARIANTS: SwitchVariant[] = [
  "primary",
  "success",
  "error",
  "warning",
  "info",
];

describe("Switch recipe/React conformance", () => {
  describe("size dimensions", () => {
    for (const size of SIZES) {
      it(`size="${size}" — width matches`, () => {
        const resolved = resolveForReact(switchRecipe, { size });
        expect(resolved["--cocso-switch-width"]).toBe(getSwitchWidth(size));
      });

      it(`size="${size}" — height matches`, () => {
        const resolved = resolveForReact(switchRecipe, { size });
        expect(resolved["--cocso-switch-height"]).toBe(getSwitchHeight(size));
      });

      it(`size="${size}" — thumbSize matches`, () => {
        const resolved = resolveForReact(switchRecipe, { size });
        expect(resolved["--cocso-switch-thumbSize"]).toBe(getThumbSize(size));
      });

      it(`size="${size}" — thumbOffset matches`, () => {
        const resolved = resolveForReact(switchRecipe, { size });
        expect(resolved["--cocso-switch-thumbOffset"]).toBe(
          getThumbOffset(size)
        );
      });
    }
  });

  describe("variant checked background color", () => {
    for (const variant of VARIANTS) {
      it(`variant="${variant}" — checkedBgColor matches`, () => {
        const resolved = resolveForReact(switchRecipe, { variant });
        expect(resolved["--cocso-switch-checkedBgColor"]).toBe(
          getCheckedColor(variant)
        );
      });
    }
  });
});
