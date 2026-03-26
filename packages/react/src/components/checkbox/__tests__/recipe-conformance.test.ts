import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { describe, expect, it } from "vitest";
import {
  type CheckboxSize,
  type CheckboxStatus,
  getBackgroundColor,
  getBorderColor,
  getRadius,
  getSize,
} from "../checkbox.styles";

const SIZES: CheckboxSize[] = ["large", "medium", "small"];
const STATUSES: CheckboxStatus[] = ["on", "off", "intermediate"];

describe("Checkbox recipe conformance", () => {
  describe("size → size (px)", () => {
    for (const size of SIZES) {
      it(`${size} size matches`, () => {
        const resolved = resolveForReact(checkboxRecipe, {
          size,
          status: "off",
        });
        expect(resolved["--cocso-checkbox-size"]).toBe(getSize(size));
      });
    }
  });

  describe("size → radius", () => {
    for (const size of SIZES) {
      it(`${size} radius matches`, () => {
        const resolved = resolveForReact(checkboxRecipe, {
          size,
          status: "off",
        });
        expect(resolved["--cocso-checkbox-radius"]).toBe(getRadius(size));
      });
    }
  });

  describe("status → borderColor", () => {
    for (const status of STATUSES) {
      it(`${status} borderColor matches`, () => {
        const resolved = resolveForReact(checkboxRecipe, {
          size: "medium",
          status,
        });
        expect(resolved["--cocso-checkbox-borderColor"]).toBe(
          getBorderColor(status)
        );
      });
    }
  });

  describe("status → bgColor", () => {
    for (const status of STATUSES) {
      it(`${status} bgColor matches`, () => {
        const resolved = resolveForReact(checkboxRecipe, {
          size: "medium",
          status,
        });
        expect(resolved["--cocso-checkbox-bgColor"]).toBe(
          getBackgroundColor(status)
        );
      });
    }
  });
});
