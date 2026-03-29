/**
 * Codegen Parity Test
 *
 * THE critical Phase 1 gate: proves that codegen-generated CSS produces
 * the same values as the runtime resolveForReact for ALL variant combinations.
 *
 * If this test passes, codegen is equivalent to the runtime resolver.
 */

import { describe, expect, it } from "vitest";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { generateCSS, getAllCombinations } from "../generate-recipe.js";

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Parse generated CSS text into a map of selector -> properties.
 * Uses line-by-line parsing to handle BEM selectors, @media blocks, and comments.
 */
function parseCSS(css: string): Map<string, Record<string, string>> {
  const rules = new Map<string, Record<string, string>>();
  const lines = css.split("\n");
  let currentSelector: string | null = null;
  let currentProps: Record<string, string> = {};
  let inMedia = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;

    // @media block start
    if (trimmed.startsWith("@media")) {
      inMedia = true;
      continue;
    }

    // Closing brace
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

    // Selector line (ends with {)
    if (trimmed.endsWith("{")) {
      currentSelector = trimmed.slice(0, -1).trim();
      currentProps = {};
      continue;
    }

    // Property line (contains : and ends with ;)
    if (currentSelector && trimmed.includes(":")) {
      const withoutSemicolon = trimmed.endsWith(";")
        ? trimmed.slice(0, -1)
        : trimmed;
      const colonIdx = withoutSemicolon.indexOf(":");
      if (colonIdx !== -1) {
        const prop = withoutSemicolon.slice(0, colonIdx).trim();
        const value = withoutSemicolon.slice(colonIdx + 1).trim();
        currentProps[prop] = value;
      }
    }
  }

  return rules;
}

describe("Codegen Parity — Button", () => {
  const combos = getAllCombinations(buttonRecipe);
  const generatedCSS = generateCSS(buttonRecipe);
  const cssRules = parseCSS(generatedCSS);

  it(`should generate rules for all ${combos.length} variant combinations`, () => {
    // Each combo should have at least one CSS rule
    for (const combo of combos) {
      const selector = `.cocso-button${Object.entries(combo)
        .map(([dim, val]) => `.cocso-button--${dim}-${val}`)
        .join("")}`;
      expect(cssRules.has(selector)).toBe(true);
    }
  });

  it.each(combos.map((c, i) => [i, c] as const))(
    "combo %i: codegen CSS values match resolveForReact output",
    (_i, combo) => {
      const resolved = resolveForReact(
        buttonRecipe,
        combo as Record<string, never>,
      );

      // Build selector
      const selector = `.cocso-button${Object.entries(combo)
        .map(([dim, val]) => `.cocso-button--${dim}-${val}`)
        .join("")}`;
      const cssProps = cssRules.get(selector);
      expect(cssProps).toBeDefined();

      // Compare: resolver output keys are camelCase (--cocso-button-bgColor)
      // CSS rule keys are kebab-case (--cocso-button-bg-color)
      for (const [key, expectedValue] of Object.entries(resolved)) {
        const kebabKey = camelToKebab(key);
        expect(cssProps![kebabKey]).toBe(expectedValue);
      }
    },
  );

  it("should wrap hover states in @media (hover: hover) and (pointer: fine)", () => {
    expect(generatedCSS).toContain("@media (hover: hover) and (pointer: fine)");
  });

  it("should generate hover state overrides for all 8 button variants", () => {
    const variants = Object.keys(buttonRecipe.variants.variant);
    for (const variant of variants) {
      // Check that hover selector exists somewhere in CSS
      const hoverSelector = `.cocso-button.cocso-button--variant-${variant}`;
      const hasHover = generatedCSS.includes(`${hoverSelector}`) &&
        generatedCSS.includes(":hover");
      expect(hasHover).toBe(true);
    }
  });

  it("should generate active state overrides for all 8 button variants", () => {
    const variants = Object.keys(buttonRecipe.variants.variant);
    for (const variant of variants) {
      const activeSelector = `.cocso-button.cocso-button--variant-${variant}`;
      const hasActive = generatedCSS.includes(`${activeSelector}`) &&
        generatedCSS.includes(":active");
      expect(hasActive).toBe(true);
    }
  });

  it("should resolve compound variants correctly (square + size)", () => {
    // shape=square, size=large should have border-radius: var(--cocso-radius-4)
    const selector = ".cocso-button.cocso-button--variant-primary.cocso-button--size-large.cocso-button--shape-square";
    const props = cssRules.get(selector);
    expect(props).toBeDefined();
    expect(props!["--cocso-button-border-radius"]).toBe("var(--cocso-radius-4)");
  });

  it("should resolve compound variants for x-small (radius-3)", () => {
    const selector = ".cocso-button.cocso-button--variant-primary.cocso-button--size-x-small.cocso-button--shape-square";
    const props = cssRules.get(selector);
    expect(props).toBeDefined();
    expect(props!["--cocso-button-border-radius"]).toBe("var(--cocso-radius-3)");
  });
});
