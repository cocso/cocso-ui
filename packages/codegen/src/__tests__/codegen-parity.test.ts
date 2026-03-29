/**
 * Codegen Parity Test
 *
 * THE critical Phase 1 gate: proves that per-dimension codegen CSS, when cascaded,
 * produces the same values as resolveForReact for ALL variant combinations.
 */

import { describe, expect, it } from "vitest";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import { generateCSS, getAllCombinations } from "../generate-recipe.js";

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Parse generated CSS into a map of selector -> properties (line-by-line parser).
 */
function parseCSS(css: string): Map<string, Record<string, string>> {
  const rules = new Map<string, Record<string, string>>();
  const lines = css.split("\n");
  let currentSelector: string | null = null;
  let currentProps: Record<string, string> = {};
  let inMedia = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;

    if (trimmed.startsWith("@media")) {
      inMedia = true;
      continue;
    }

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
      currentProps = {};
      continue;
    }

    if (currentSelector && trimmed.includes(":")) {
      const withoutSemicolon = trimmed.endsWith(";") ? trimmed.slice(0, -1) : trimmed;
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

/**
 * Simulate CSS cascade: collect all matching rules for a variant combo,
 * applying them in order (base → dimension → compound → state).
 */
function cascadeForCombo(
  cssRules: Map<string, Record<string, string>>,
  name: string,
  combo: Record<string, string>,
  state?: string,
): Record<string, string> {
  const result: Record<string, string> = {};

  // 1. Base rule: .cocso-button
  const baseProps = cssRules.get(`.${name}`);
  if (baseProps) Object.assign(result, baseProps);

  // 2. Per-dimension rules: .cocso-button.cocso-button--variant-primary
  for (const [dim, val] of Object.entries(combo)) {
    const dimProps = cssRules.get(`.${name}.${name}--${dim}-${val}`);
    if (dimProps) Object.assign(result, dimProps);
  }

  // 3. Compound variant rules (multi-modifier selectors)
  for (const [selector, props] of cssRules) {
    // Skip base, single-dimension, and state rules
    if (selector.includes(":")) continue;
    const modifiers = selector.split(`.${name}--`).slice(1);
    if (modifiers.length < 2) continue; // compound needs 2+ dimensions

    // Check if all modifiers in the selector match the combo
    const allMatch = modifiers.every((mod) => {
      const [dim, ...valParts] = mod.split("-");
      const val = valParts.join("-"); // handle "x-small"
      return combo[dim] === val;
    });
    if (allMatch) Object.assign(result, props);
  }

  // 4. State override rules
  if (state) {
    for (const [dim, val] of Object.entries(combo)) {
      const pseudo = state === "hover" ? ":hover" : state === "active" ? ":active" : `:${state}`;
      const stateProps = cssRules.get(`.${name}.${name}--${dim}-${val}${pseudo}`);
      if (stateProps) Object.assign(result, stateProps);
    }
  }

  return result;
}

describe("Codegen Parity — Button", () => {
  const generatedCSS = generateCSS(buttonRecipe);
  const cssRules = parseCSS(generatedCSS);
  const combos = getAllCombinations(buttonRecipe);

  it("should be compact (per-dimension, not Cartesian product)", () => {
    const lineCount = generatedCSS.split("\n").length;
    // 8 variant + 4 size + 3 shape + 2 compound + 16 states ≈ 33 rules
    // Each rule ~5 lines → ~165 lines + formatting
    expect(lineCount).toBeLessThan(300);
  });

  it("should generate per-dimension variant rules", () => {
    // 8 variant values
    for (const val of Object.keys(buttonRecipe.variants.variant)) {
      expect(cssRules.has(`.cocso-button.cocso-button--variant-${val}`)).toBe(true);
    }
    // 4 size values
    for (const val of Object.keys(buttonRecipe.variants.size)) {
      expect(cssRules.has(`.cocso-button.cocso-button--size-${val}`)).toBe(true);
    }
    // shape values (only circle and rounded have styles; square is empty)
    expect(cssRules.has(".cocso-button.cocso-button--shape-circle")).toBe(true);
    expect(cssRules.has(".cocso-button.cocso-button--shape-rounded")).toBe(true);
  });

  it("should generate compound variant rules", () => {
    // shape=square + size=x-small → radius-3
    expect(cssRules.has(".cocso-button.cocso-button--shape-square.cocso-button--size-x-small")).toBe(true);
    const xsProps = cssRules.get(".cocso-button.cocso-button--shape-square.cocso-button--size-x-small")!;
    expect(xsProps["--cocso-button-border-radius"]).toBe("var(--cocso-radius-3)");

    // shape=square + size=large → radius-4
    expect(cssRules.has(".cocso-button.cocso-button--shape-square.cocso-button--size-large")).toBe(true);
    const lgProps = cssRules.get(".cocso-button.cocso-button--shape-square.cocso-button--size-large")!;
    expect(lgProps["--cocso-button-border-radius"]).toBe("var(--cocso-radius-4)");
  });

  it("should wrap hover states in @media (hover: hover) and (pointer: fine)", () => {
    expect(generatedCSS).toContain("@media (hover: hover) and (pointer: fine)");
  });

  it("should generate hover state rules for all 8 variants", () => {
    for (const val of Object.keys(buttonRecipe.variants.variant)) {
      expect(cssRules.has(`.cocso-button.cocso-button--variant-${val}:hover`)).toBe(true);
    }
  });

  it("should generate active state rules for all 8 variants", () => {
    for (const val of Object.keys(buttonRecipe.variants.variant)) {
      expect(cssRules.has(`.cocso-button.cocso-button--variant-${val}:active`)).toBe(true);
    }
  });

  // THE CORE PARITY TEST: cascade simulation matches resolveForReact
  it.each(combos.map((c, i) => [i, c] as const))(
    "combo %i: cascaded CSS matches resolveForReact output",
    (_i, combo) => {
      // Get the expected output from the runtime resolver
      const resolved = resolveForReact(buttonRecipe, combo as Record<string, never>);

      // Simulate CSS cascade for this combo
      const cascaded = cascadeForCombo(cssRules, "cocso-button", combo);

      // Every property from resolveForReact should be present in cascaded CSS
      for (const [key, expectedValue] of Object.entries(resolved)) {
        const kebabKey = camelToKebab(key);
        expect(cascaded[kebabKey]).toBe(expectedValue);
      }
    },
  );
});
