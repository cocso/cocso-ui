/**
 * Generate pre-resolved Figma JSON descriptors for all recipes.
 * Outputs to packages/codegen/generated/*.figma.json for consumption
 * by Figma generators and as a codegen artifact.
 *
 * Usage: pnpm --filter @cocso-ui/figma generate:figma-json
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RecipeDefinition } from "@cocso-ui/recipe";
import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { paginationRecipe } from "@cocso-ui/recipe/recipes/pagination.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import { resolveForFigma } from "../src/generators/recipe-resolver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, "..", "..", "codegen", "generated");

// biome-ignore lint: any recipe type
type AnyRecipe = RecipeDefinition<any, any>;

const ALL_RECIPES: AnyRecipe[] = [
  badgeRecipe,
  buttonRecipe,
  checkboxRecipe,
  dialogRecipe,
  inputRecipe,
  linkRecipe,
  paginationRecipe,
  radioGroupRecipe,
  selectRecipe,
  spinnerRecipe,
  stockQuantityStatusRecipe,
  switchRecipe,
  typographyRecipe,
];

function getAllCombinations(recipe: AnyRecipe): Record<string, string>[] {
  const dimensions = Object.entries(recipe.variants).map(([dim, values]) => ({
    dim,
    values: Object.keys(values as Record<string, unknown>),
  }));
  const combos: Record<string, string>[] = [];
  function walk(idx: number, current: Record<string, string>) {
    if (idx === dimensions.length) {
      combos.push({ ...current });
      return;
    }
    const { dim, values } = dimensions[idx];
    for (const val of values) {
      current[dim] = val;
      walk(idx + 1, current);
    }
  }
  walk(0, {});
  return combos;
}

function generate() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const recipe of ALL_RECIPES) {
    const combos = getAllCombinations(recipe);
    const stateNames = recipe.states ? Object.keys(recipe.states) : [];
    const figmaData: Record<string, unknown> = {
      name: recipe.name,
      slots: [...recipe.slots],
      combinations: {} as Record<string, unknown>,
    };

    const combinations = figmaData.combinations as Record<string, unknown>;
    for (const combo of combos) {
      const comboKey = Object.entries(combo)
        .map(([dim, val]) => `${dim}=${val}`)
        .join(",");

      const spec = resolveForFigma(recipe, combo as Record<string, never>);
      const entry: Record<string, unknown> = { ...spec };

      if (stateNames.length > 0) {
        const states: Record<string, unknown> = {};
        for (const state of stateNames) {
          states[state] = resolveForFigma(
            recipe,
            combo as Record<string, never>,
            { state }
          );
        }
        entry.states = states;
      }

      combinations[comboKey] = entry;
    }

    writeFileSync(
      join(OUTPUT_DIR, `${recipe.name}.figma.json`),
      JSON.stringify(figmaData, null, 2),
      "utf-8"
    );
    console.log(`  ✓ ${recipe.name}.figma.json (${combos.length} combos)`);
  }

  console.log(`\nDone. Generated ${ALL_RECIPES.length} Figma JSON files.`);
}

generate();
