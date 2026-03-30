import { describe, expect, it } from "vitest";
import { getSpinnerGeometry } from "../recipes/spinner.recipe";
import { badgeRecipe } from "../recipes/badge.recipe";
import { buttonRecipe } from "../recipes/button.recipe";
import { checkboxRecipe } from "../recipes/checkbox.recipe";
import { dialogRecipe } from "../recipes/dialog.recipe";
import { inputRecipe } from "../recipes/input.recipe";
import { linkRecipe } from "../recipes/link.recipe";
import { paginationRecipe } from "../recipes/pagination.recipe";
import { radioGroupRecipe } from "../recipes/radio-group.recipe";
import { selectRecipe } from "../recipes/select.recipe";
import { spinnerRecipe } from "../recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "../recipes/stock-quantity-status.recipe";
import { switchRecipe } from "../recipes/switch.recipe";
import { typographyRecipe } from "../recipes/typography.recipe";

describe("recipe definitions", () => {
  const recipes = [
    { name: "badge", recipe: badgeRecipe },
    { name: "button", recipe: buttonRecipe },
    { name: "checkbox", recipe: checkboxRecipe },
    { name: "dialog", recipe: dialogRecipe },
    { name: "input", recipe: inputRecipe },
    { name: "link", recipe: linkRecipe },
    { name: "pagination", recipe: paginationRecipe },
    { name: "radio", recipe: radioGroupRecipe },
    { name: "select", recipe: selectRecipe },
    { name: "spinner", recipe: spinnerRecipe },
    { name: "stock-quantity-status", recipe: stockQuantityStatusRecipe },
    { name: "switch", recipe: switchRecipe },
    { name: "typography", recipe: typographyRecipe },
  ];

  describe("getSpinnerGeometry", () => {
    it("returns geometry for a valid spinner size", () => {
      const geo = getSpinnerGeometry("medium");
      expect(geo).toHaveProperty("bladeHeight");
      expect(geo).toHaveProperty("bladeRadius");
      expect(geo).toHaveProperty("blades");
      expect(geo).toHaveProperty("bladeWidth");
      expect(geo).toHaveProperty("output");
      expect(typeof geo.bladeHeight).toBe("number");
    });

    it("returns different geometries for different sizes", () => {
      const sm = getSpinnerGeometry("small");
      const lg = getSpinnerGeometry("large");
      expect(sm.bladeHeight).not.toBe(lg.bladeHeight);
    });
  });

  for (const { name, recipe } of recipes) {
    it(`${name} recipe has correct name`, () => {
      expect(recipe.name).toBe(name);
    });

    it(`${name} recipe has at least one slot`, () => {
      expect(recipe.slots.length).toBeGreaterThan(0);
    });

    it(`${name} recipe has at least one variant dimension`, () => {
      expect(Object.keys(recipe.variants).length).toBeGreaterThan(0);
    });
  }
});
