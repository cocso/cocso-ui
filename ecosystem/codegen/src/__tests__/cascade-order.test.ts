/**
 * Cascade order — what holds the generated CSS together now that specificity does not
 *
 * Every generated rule sits at (0,1,0): the component's own class, with the
 * modifier classes inside `:where()`, which contributes nothing. That is
 * deliberate — it is what lets a consumer override a
 * `--cocso-<component>-<property>` with a single class of their own instead of
 * reaching for `!important`, which used to also delete the component's hover
 * state as collateral.
 *
 * The cost is that precedence between the library's own rules is decided by
 * emission order alone. Before, a compound rule outranked the single-variant
 * rules it refines by specificity (0,3,0 against 0,2,0) and order was
 * incidental; now order is the whole mechanism. Reordering `generateCSS` — or
 * merging rules in a way that moves one earlier — would silently hand
 * precedence to the wrong rule, and the parity test would not see it because
 * it computes the cascade itself rather than trusting the file.
 *
 * So: base first, then per-dimension variants, then compound variants.
 */

import { defineRecipe } from "@cocso-ui/recipe";
import { describe, expect, it } from "vitest";
import { generateCSS } from "../generate-recipe";

const recipe = defineRecipe({
  name: "test-order",
  slots: ["root"] as const,
  variants: {
    shape: {
      square: { root: { borderRadius: "radius-2" } },
      circle: { root: { borderRadius: "100%" } },
    },
    size: {
      sm: { root: { height: 24 } },
      lg: { root: { height: 48 } },
    },
  },
  compoundVariants: [
    {
      conditions: { shape: "square", size: "lg" },
      styles: { root: { borderRadius: "radius-4" } },
    },
  ],
  defaultVariants: { shape: "square", size: "lg" },
  base: { root: { fontWeight: "semibold" } },
});

const css = generateCSS(recipe);

/** Index of a selector's rule block in the generated file, or -1. */
function positionOf(selector: string): number {
  return css.indexOf(`${selector} {`);
}

const BASE = ".cocso-test-order";
const VARIANT = ".cocso-test-order:where(.cocso-test-order--shape-square)";
const COMPOUND =
  ".cocso-test-order:where(.cocso-test-order--shape-square.cocso-test-order--size-lg)";

describe("every generated rule has the same specificity", () => {
  it("wraps modifier classes in :where() so they add nothing", () => {
    const ruleSelectors = [...css.matchAll(/^(\S.*?) \{$/gm)].map(
      ([, selector]) => selector
    );
    expect(ruleSelectors.length).toBeGreaterThan(2);

    for (const selector of ruleSelectors) {
      // Either the bare component class, or that class plus a :where() group.
      // A modifier class outside :where() would raise the specificity above a
      // consumer's single class and close the documented override path.
      expect(selector).toMatch(
        /^\.cocso-[a-z0-9-]+(?::where\((?:\.cocso-[a-z0-9-]+)+\))?$/
      );
    }
  });
});

describe("precedence therefore rests on emission order", () => {
  it("emits base before the variants that refine it", () => {
    expect(positionOf(BASE)).toBeGreaterThanOrEqual(0);
    expect(positionOf(VARIANT)).toBeGreaterThan(positionOf(BASE));
  });

  it("emits compound variants after the single variants they refine", () => {
    expect(positionOf(COMPOUND)).toBeGreaterThan(positionOf(VARIANT));
  });

  it("gives the compound rule the last word on a shared property", () => {
    // Both set border-radius. `shape=square` says radius-2, and the
    // square+large compound says radius-4. With equal specificity the winner is
    // whichever is written last, and it has to be the compound.
    const variantBlock = css.slice(positionOf(VARIANT));
    const compoundBlock = css.slice(positionOf(COMPOUND));
    expect(variantBlock).toContain("var(--cocso-radius-2)");
    expect(compoundBlock).toContain("var(--cocso-radius-4)");
    expect(positionOf(COMPOUND)).toBeGreaterThan(positionOf(VARIANT));
  });
});
