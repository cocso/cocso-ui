/**
 * Codegen Parity Test — ALL recipes
 *
 * Proves that per-dimension codegen CSS, when cascaded, produces the same
 * values as resolveForReact for ALL variant combinations of ALL recipes.
 */

import { describe, expect, it } from "vitest";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { resolveStyleMap } from "@cocso-ui/recipe/resolvers/react-styles";
import type { RecipeDefinition, SlotStyles } from "@cocso-ui/recipe";
import { alertRecipe } from "@cocso-ui/recipe/recipes/alert.recipe";
import { avatarRecipe } from "@cocso-ui/recipe/recipes/avatar.recipe";
import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { breadcrumbRecipe } from "@cocso-ui/recipe/recipes/breadcrumb.recipe";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { cardRecipe } from "@cocso-ui/recipe/recipes/card.recipe";
import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { paginationRecipe } from "@cocso-ui/recipe/recipes/pagination.recipe";
import { progressRecipe } from "@cocso-ui/recipe/recipes/progress.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { skeletonRecipe } from "@cocso-ui/recipe/recipes/skeleton.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import { generateCSS, getAllCombinations } from "../generate-recipe.js";

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function parseCSS(css: string): Map<string, Record<string, string>> {
  const rules = new Map<string, Record<string, string>>();
  const lines = css.split("\n");
  let currentSelector: string | null = null;
  let currentProps: Record<string, string> = {};
  let inMedia = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;
    if (trimmed.startsWith("@media")) { inMedia = true; continue; }
    if (trimmed === "}") {
      if (currentSelector) {
        rules.set(currentSelector, currentProps);
        currentSelector = null;
        currentProps = {};
      } else if (inMedia) {
        inMedia = false;
      }
      continue;
    }
    if (trimmed.endsWith("{")) {
      currentSelector = trimmed.slice(0, -1).trim();
      currentProps = rules.get(currentSelector) ?? {};
      continue;
    }
    if (currentSelector && trimmed.includes(":")) {
      const withoutSemicolon = trimmed.endsWith(";") ? trimmed.slice(0, -1) : trimmed;
      const colonIdx = withoutSemicolon.indexOf(":");
      if (colonIdx !== -1) {
        currentProps[withoutSemicolon.slice(0, colonIdx).trim()] =
          withoutSemicolon.slice(colonIdx + 1).trim();
      }
    }
  }
  return rules;
}

/**
 * Simulate CSS cascade: collect all matching rules for a variant combo.
 */
function cascadeForCombo(
  cssRules: Map<string, Record<string, string>>,
  name: string,
  combo: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {};

  // 1. Base
  const baseProps = cssRules.get(`.${name}`);
  if (baseProps) Object.assign(result, baseProps);

  // 2. Per-dimension
  for (const [dim, val] of Object.entries(combo)) {
    const dimProps = cssRules.get(`.${name}.${name}--${dim}-${val}`);
    if (dimProps) Object.assign(result, dimProps);
  }

  // 3. Compound (multi-modifier selectors)
  for (const [selector, props] of cssRules) {
    if (selector.includes(":")) continue;
    const modifiers = selector.split(`.${name}--`).slice(1);
    if (modifiers.length < 2) continue;
    // NOTE: This parser splits on the first dash to separate dimension from
    // value (e.g., "variant-primary" → dim="variant", val="primary").
    // This works because dimension names are single camelCase words (no dashes).
    // Variant values may contain dashes (e.g., "x-small" → dim="size", val="x-small").
    // Convention enforced by defineRecipe() in @cocso-ui/recipe.
    const allMatch = modifiers.every((mod) => {
      const dashIdx = mod.indexOf("-");
      if (dashIdx === -1) return false;
      const dim = mod.slice(0, dashIdx);
      const val = mod.slice(dashIdx + 1);
      return combo[dim] === val;
    });
    if (allMatch) Object.assign(result, props);
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecipe = RecipeDefinition<any, any>;

const ALL_RECIPES: AnyRecipe[] = [
  alertRecipe,
  avatarRecipe,
  badgeRecipe,
  breadcrumbRecipe,
  buttonRecipe,
  cardRecipe,
  checkboxRecipe,
  dialogRecipe,
  inputRecipe,
  linkRecipe,
  paginationRecipe,
  progressRecipe,
  radioGroupRecipe,
  selectRecipe,
  skeletonRecipe,
  spinnerRecipe,
  stockQuantityStatusRecipe,
  switchRecipe,
  typographyRecipe,
];

for (const recipe of ALL_RECIPES) {
  describe(`Codegen Parity — ${recipe.name}`, () => {
    const generatedCSS = generateCSS(recipe);
    const cssRules = parseCSS(generatedCSS);
    const combos = getAllCombinations(recipe);
    const stateNames = recipe.states ? Object.keys(recipe.states) : [];

    it("should be compact (no Cartesian explosion)", () => {
      const lineCount = generatedCSS.split("\n").length;
      // Per-dimension CSS should never exceed 20 lines per variant value
      const dimValues = Object.values(recipe.variants as Record<string, Record<string, unknown>>)
        .reduce((sum, v) => sum + Object.keys(v).length, 0);
      const maxExpected = (dimValues + (recipe.compoundVariants?.length ?? 0) + stateNames.length * dimValues) * 8 + 20;
      expect(lineCount).toBeLessThan(maxExpected);
    });

    it.each(combos.map((c, i) => [i, c] as const))(
      `combo %i: cascaded CSS matches resolveStyleMap (incl. state-suffixed)`,
      (_i, combo) => {
        const resolved = resolveStyleMap(recipe, combo as Record<string, never>, {
          states: stateNames,
        });
        const cascaded = cascadeForCombo(cssRules, `cocso-${recipe.name}`, combo);

        for (const [key, expectedValue] of Object.entries(resolved)) {
          expect(cascaded[key]).toBe(expectedValue);
        }
      },
    );

    if (stateNames.length > 0) {
      it("should generate state-suffixed properties", () => {
        for (const state of stateNames) {
          const hasSuffixed = [...cssRules.values()].some((props) =>
            Object.keys(props).some((k) => k.endsWith(`-${state}`)),
          );
          expect(hasSuffixed).toBe(true);
        }
      });
    }
  });
}
