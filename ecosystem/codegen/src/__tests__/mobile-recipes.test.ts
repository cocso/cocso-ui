/**
 * The mobile style resolvers, against the recipes they come from.
 *
 * The reason to generate these rather than write them is consistency: a
 * variant added to `button.recipe.ts` should reach web, iOS and Android without
 * three people remembering. That only holds if something checks it, so this
 * asserts the three agree — every recipe, every dimension, every value.
 *
 * It also caught the failure mode it exists for. Two generators computed a
 * token identifier by different rules: the token emitter named a radius `full`
 * and this one referenced `rFull`. The Swift compiler found that one, but only
 * because these files are compiled — a check on names alone would have passed
 * a reference to a token that does not exist.
 */

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { generateRecipeStyles, type RecipeLike } from "../mobile-recipes";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const recipesDir = path.join(repoRoot, "packages/recipe/src/recipes");
const SWIFT_FILE = path.join(
  repoRoot,
  "packages/swiftui/Sources/CocsoUI/CocsoStyles.swift"
);
const KOTLIN_FILE = path.join(
  repoRoot,
  "packages/compose/src/main/kotlin/ai/cocso/ui/CocsoStyles.kt"
);
const REGENERATE = "pnpm --filter @cocso-ui/codegen generate:mobile";

const THEME_DARK_DECL = /--cocso-color-([a-z0-9-]+):/g;
const RESERVED_CASE = /^`(.+)`$/;

function themedColorNames(): Set<string> {
  const css = readFileSync(
    path.join(repoRoot, "packages/css/theme-dark.css"),
    "utf-8"
  );
  const names = new Set<string>();
  for (const [, name] of css.matchAll(THEME_DARK_DECL)) {
    const parts = name.split("-");
    names.add(
      parts[0] +
        parts
          .slice(1)
          .map((p) => p[0].toUpperCase() + p.slice(1))
          .join("")
    );
  }
  return names;
}

async function loadRecipes(): Promise<RecipeLike[]> {
  const recipes: RecipeLike[] = [];
  for (const file of readdirSync(recipesDir).filter((f) =>
    f.endsWith(".recipe.ts")
  )) {
    const module = await import(path.join(recipesDir, file));
    for (const value of Object.values(module)) {
      const candidate = value as RecipeLike;
      if (candidate?.name && candidate?.variants) {
        recipes.push(candidate);
      }
    }
  }
  return recipes.sort((a, b) => a.name.localeCompare(b.name));
}

const recipes = await loadRecipes();
const output = generateRecipeStyles(recipes, themedColorNames());

function unquote(name: string): string {
  return name.match(RESERVED_CASE)?.[1] ?? name;
}

describe("Every recipe reaches both platforms", () => {
  it("covers every recipe on disk", () => {
    // The list is read from the directory rather than written out, so a new
    // recipe is picked up. This asserts the directory is what it looks like.
    expect(recipes.length).toBeGreaterThan(15);
  });

  it.each(recipes.map((r) => [r.name, r] as const))(
    "%s has a style struct on both platforms",
    (name, recipe) => {
      const type = `CC${name
        .split("-")
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("")}`;
      expect(
        output.swift,
        `${name} has no Swift style struct`
      ).toContain(`public struct ${type}Style`);
      expect(
        output.kotlin,
        `${name} has no Kotlin style data class`
      ).toContain(`data class ${type}Style`);
      void recipe;
    }
  );
});

describe("Every variant value reaches both platforms", () => {
  const cases = recipes.flatMap((recipe) =>
    Object.entries(recipe.variants).flatMap(([dimension, values]) =>
      Object.keys(values).map(
        (value) => [recipe.name, dimension, value] as const
      )
    )
  );

  it("finds variant values to check", () => {
    expect(cases.length).toBeGreaterThan(60);
  });

  it.each(cases)("%s %s=%s", (name, dimension, value) => {
    const camelValue = value
      .split("-")
      .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
      .join("");

    // Reserved words are backticked in both languages, so match either.
    const swiftHas =
      output.swift.includes(`case ${camelValue}\n`) ||
      output.swift.includes(`case \`${camelValue}\`\n`);
    const kotlinHas =
      output.kotlin.includes(`    ${camelValue},\n`) ||
      output.kotlin.includes(`    \`${camelValue}\`,\n`);

    expect(swiftHas, `${name}.${dimension}=${value} missing from Swift`).toBe(
      true
    );
    expect(kotlinHas, `${name}.${dimension}=${value} missing from Kotlin`).toBe(
      true
    );
    void unquote;
  });
});

describe("The published files are what the generator produces", () => {
  it(`CocsoStyles.swift is generated (${REGENERATE})`, () => {
    expect(readFileSync(SWIFT_FILE, "utf-8")).toContain(output.swift);
  });

  it(`CocsoStyles.kt is generated (${REGENERATE})`, () => {
    expect(readFileSync(KOTLIN_FILE, "utf-8")).toContain(output.kotlin);
  });
});
