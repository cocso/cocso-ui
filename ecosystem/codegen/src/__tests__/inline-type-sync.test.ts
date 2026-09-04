/**
 * Inline React unions against the recipes they copy.
 *
 * AGENTS.md prohibits re-exporting from codegen, so each component declares
 * its variant unions by hand — `export type ButtonSize = "large" | ...`. That
 * is a second copy of the recipe's keys, and a second copy is free to drift.
 *
 * This file used to check two components, Spinner and RadioGroup. The recipe
 * gained `x-large` for the button, the CSS and both mobile platforms carried
 * it, the changelog announced `size="x-large"`, and `@cocso-ui/react@1.3.0`
 * shipped with `ButtonSize` still ending at `x-small` — a type error for the
 * feature the release notes described. Nothing here looked at Button.
 *
 * Now every recipe is checked against the component of the same name, for
 * every dimension the component declares. A dimension the component does not
 * declare is listed, not silently skipped.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const recipesDir = path.join(repoRoot, "packages/recipe/src/recipes");
const componentsDir = path.join(repoRoot, "packages/react/src/components");

interface RecipeLike {
  name: string;
  variants: Record<string, Record<string, unknown>>;
}

async function loadRecipes(): Promise<RecipeLike[]> {
  const out: RecipeLike[] = [];
  for (const file of readdirSync(recipesDir).filter((f) => f.endsWith(".recipe.ts"))) {
    const mod = await import(path.join(recipesDir, file));
    for (const value of Object.values(mod)) {
      const r = value as RecipeLike;
      if (r?.name && r?.variants) out.push(r);
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const pascal = (kebab: string) =>
  kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

/** `export type ButtonSize = "a" | "b";` → ["a", "b"], or null when absent. */
function inlineUnion(source: string, typeName: string): string[] | null {
  const m = source.match(new RegExp(`export type ${typeName}\\s*=\\s*([^;]+);`));
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map(([, v]) => v).sort();
}

/**
 * Components whose inline union deliberately differs from the recipe, with
 * the reason. Add here only with a reason; an empty reason is a drift.
 */
const KNOWN_DIVERGENCE: Readonly<Record<string, string>> = {};

const recipes = await loadRecipes();

describe("Inline React unions match the recipe they copy", () => {
  const cases: { recipe: string; dimension: string; typeName: string; tsx: string }[] = [];
  const undeclared: string[] = [];

  for (const recipe of recipes) {
    const tsx = path.join(componentsDir, recipe.name, `${recipe.name}.tsx`);
    if (!existsSync(tsx)) continue;
    const source = readFileSync(tsx, "utf-8");
    for (const dimension of Object.keys(recipe.variants)) {
      const typeName = `${pascal(recipe.name)}${pascal(dimension)}`;
      if (inlineUnion(source, typeName) === null) {
        undeclared.push(`${recipe.name}.${dimension} (${typeName})`);
        continue;
      }
      cases.push({ recipe: recipe.name, dimension, typeName, tsx });
    }
  }

  it("has components to check", () => {
    expect(cases.length).toBeGreaterThan(10);
  });

  it.each(cases)("$typeName matches $recipe.variants.$dimension", ({ recipe, dimension, typeName, tsx }) => {
    const key = `${recipe}.${dimension}`;
    const inline = inlineUnion(readFileSync(tsx, "utf-8"), typeName) ?? [];
    const fromRecipe = Object.keys(recipes.find((r) => r.name === recipe)!.variants[dimension]).sort();
    if (KNOWN_DIVERGENCE[key]) {
      expect(KNOWN_DIVERGENCE[key].length, `${key} is listed as divergent with no reason`).toBeGreaterThan(0);
      return;
    }
    expect(inline, `${typeName} in ${recipe}.tsx has drifted from the recipe`).toEqual(fromRecipe);
  });

  it("names the dimensions no component declares a type for", () => {
    // Informational: printed so a missing prop type is a decision, not an
    // accident. Not a failure — a component may expose fewer dimensions.
    console.info(`inline-type-sync: ${undeclared.length} recipe dimensions without an inline type:\n  ${undeclared.join("\n  ")}`);
    expect(Array.isArray(undeclared)).toBe(true);
  });
});
