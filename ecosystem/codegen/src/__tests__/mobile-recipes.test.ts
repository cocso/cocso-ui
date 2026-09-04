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
import { UNITLESS_PROPERTIES } from "@cocso-ui/recipe";
import { generateCSS } from "../generate-recipe";
import { generateRecipeStyles, type RecipeLike } from "../mobile-recipes";

/** `font-weight` back to the `fontWeight` the recipe wrote. */
function camelCase(kebab: string): string {
  return kebab.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

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

/**
 * What the generator refuses to carry.
 *
 * A refusal is printed, which is the honest half — but printing is not a gate,
 * and the view on the other side has no way to know. `borderRadius: "100%"`
 * was refused for a year of this file's life, and `CCButton(shape: .circle)`
 * drew a square on both platforms because each view was left to notice the
 * shape from the variant's name and two of them did not.
 *
 * So the set is pinned. A recipe that starts using a property this cannot
 * carry fails here, where the choice is still open — teach the generator, or
 * decide the property has no platform equivalent and write down why.
 */
describe("Nothing is dropped without a decision", () => {
  const NO_PLATFORM_EQUIVALENT = [
    // A CSS border is width, style and colour in one value. Both platforms
    // take them separately, and no single property here can hold it.
    "badge.border",
    "button.border",
    "card.border",
    "dialog.border",
    // `transparent` and `currentColor` are absences, not colours: SwiftUI says
    // `.clear` and Compose leaves the background unset.
    "badge.bgColor",
    "button.bgColor",
    "link.color",
    // The recipe's `align` dimension already carries this, and the views read
    // it from there.
    "button.justifyContent",
  ].sort();

  it("refuses only what has no platform equivalent", () => {
    // A property refused in several variant layers is one decision.
    const refused = [
      ...new Set(
        output.skipped.map(({ recipe, property }) => `${recipe}.${property}`)
      ),
    ].sort();
    expect(refused).toEqual(NO_PLATFORM_EQUIVALENT);
  });

  it("gives every refusal a reason", () => {
    for (const { recipe, property, reason } of output.skipped) {
      expect(reason, `${recipe}.${property} was dropped silently`).toBeTruthy();
    }
  });
});

/**
 * Units on properties that do not take them.
 *
 * `resolveStyleValue` turns every number into a length, which is right for
 * almost all of them. It was wrong for four: the web's headings and its active
 * pagination page asked for `font-weight: 600px` and `700px`, which a browser
 * discards — they were not bold at all — and the spinner published its blade
 * count as `10px`, which fails inside the `calc()` a consumer divides by.
 *
 * The mobile emitter got these right, which is how they surfaced: the two
 * sides of the same recipe disagreed, and only one of them was wrong.
 */
describe("Numbers carry a unit only where CSS takes one", () => {
  it("never puts a length on an unitless property", () => {
    const offenders: string[] = [];
    for (const recipe of recipes) {
      for (const line of generateCSS(recipe as never).split("\n")) {
        const match = line.match(/--cocso-[\w-]*?-([\w-]+): (-?[\d.]+)(px|rem|em);/);
        if (match && UNITLESS_PROPERTIES.has(camelCase(match[1]))) {
          offenders.push(`${recipe.name}: ${line.trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
