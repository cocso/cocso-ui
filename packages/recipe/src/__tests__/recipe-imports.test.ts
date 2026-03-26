import { describe, expect, it } from "vitest";
import { badgeRecipe } from "../recipes/badge.recipe";
import { buttonRecipe } from "../recipes/button.recipe";
import { checkboxRecipe } from "../recipes/checkbox.recipe";
import { inputRecipe } from "../recipes/input.recipe";
import { linkRecipe } from "../recipes/link.recipe";
import { radioGroupRecipe } from "../recipes/radio-group.recipe";
import { selectRecipe } from "../recipes/select.recipe";
import { spinnerRecipe } from "../recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "../recipes/stock-quantity-status.recipe";
import { switchRecipe } from "../recipes/switch.recipe";

describe("recipe definitions", () => {
  const recipes = [
    { name: "badge", recipe: badgeRecipe },
    { name: "button", recipe: buttonRecipe },
    { name: "checkbox", recipe: checkboxRecipe },
    { name: "input", recipe: inputRecipe },
    { name: "link", recipe: linkRecipe },
    { name: "radio", recipe: radioGroupRecipe },
    { name: "select", recipe: selectRecipe },
    { name: "spinner", recipe: spinnerRecipe },
    { name: "stock-quantity-status", recipe: stockQuantityStatusRecipe },
    { name: "switch", recipe: switchRecipe },
  ];

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
