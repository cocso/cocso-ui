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
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { generateCSS, generateRuntime, generateTypes } from "./generate-recipe.js";

const GENERATED_DIR = join(import.meta.dirname, "..", "generated");

function generate() {
  mkdirSync(GENERATED_DIR, { recursive: true });

  // Phase 1: button only
  const recipes = [buttonRecipe];

  for (const recipe of recipes) {
    const name = recipe.name;
    console.log(`Generating ${name}...`);

    const css = generateCSS(recipe);
    writeFileSync(join(GENERATED_DIR, `${name}.css`), css, "utf-8");

    const runtime = generateRuntime(recipe);
    writeFileSync(join(GENERATED_DIR, `${name}.ts`), runtime, "utf-8");

    const types = generateTypes(recipe);
    writeFileSync(join(GENERATED_DIR, `${name}.d.ts`), types, "utf-8");

    console.log(`  ✓ ${name}.css (${css.split("\n").length} lines)`);
    console.log(`  ✓ ${name}.ts`);
    console.log(`  ✓ ${name}.d.ts`);
  }

  console.log(`\nDone. Generated ${recipes.length} recipe(s) to ${GENERATED_DIR}`);
}

generate();
