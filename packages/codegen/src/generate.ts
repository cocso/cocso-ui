/**
 * Main codegen entry point.
 * Imports recipe definitions at build time via tsx and generates:
 * - CSS files (BEM classes with CSS custom property values)
 * - JS runtime (className composition functions)
 * - TS type declarations
 *
 * Usage: pnpm --filter @cocso-ui/codegen generate
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
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
import { generateCSS, generateRuntime, generateTypes } from "./generate-recipe.js";

const GENERATED_DIR = join(import.meta.dirname, "..", "generated");

const ALL_RECIPES = [
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

function generate() {
  mkdirSync(GENERATED_DIR, { recursive: true });

  let totalCSS = 0;
  for (const recipe of ALL_RECIPES) {
    const name = recipe.name;
    console.log(`Generating ${name}...`);

    const css = generateCSS(recipe);
    const cssLines = css.split("\n").length;
    totalCSS += cssLines;
    writeFileSync(join(GENERATED_DIR, `${name}.css`), css, "utf-8");

    const runtime = generateRuntime(recipe);
    writeFileSync(join(GENERATED_DIR, `${name}.ts`), runtime, "utf-8");

    const types = generateTypes(recipe);
    writeFileSync(join(GENERATED_DIR, `${name}.d.ts`), types, "utf-8");

    console.log(`  ✓ ${name}.css (${cssLines} lines)`);
  }

  console.log(`\nDone. Generated ${ALL_RECIPES.length} recipe(s), ${totalCSS} total CSS lines.`);
}

generate();
