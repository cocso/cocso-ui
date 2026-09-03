/**
 * Dark theme coverage — a token that does not move said so on purpose
 *
 * The generator now requires every token in the `theme` collection to declare
 * both a light and a dark value, so "a semantic token with no dark value" is no
 * longer expressible. That closes the hole the `feedback-*` bases fell through,
 * where the absence of a value was indistinguishable from a decision.
 *
 * What it does not close is the other half: a dark value written to equal the
 * light one. That is correct for the fixed-hue `interactive-*` fills and their
 * `text-on-*` foregrounds, and it is a defect for anything else — and the two
 * look identical in the source. This keeps the distinction, one step further
 * along than before: a token whose dark value matches its light one is listed
 * here with the reason.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const CSS_DIR = join(import.meta.dirname, "..", "..", "..", "css");

function readCss(file: string): string {
  return readFileSync(join(CSS_DIR, file), "utf-8");
}

/** Tokens whose light value points at another color token. */
function semanticTokens(css: string): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const [, name, value] of css.matchAll(
    /--cocso-color-([a-z0-9-]+):\s*([^;]+);/g
  )) {
    const trimmed = value.trim();
    if (trimmed.startsWith("var(--cocso-color-")) {
      tokens.set(name, trimmed);
    }
  }
  return tokens;
}

function declaredTokens(css: string): Map<string, string> {
  return new Map(
    [...css.matchAll(/--cocso-color-([a-z0-9-]+):\s*([^;]+);/g)].map(
      ([, name, value]) => [name, value.trim()]
    )
  );
}

/**
 * `primary-*` aliases the neutral ramp, which makes it look semantic by the
 * rule above. It is the documented theming entry point: a consumer redefines
 * it in their own `:root` and the dark theme must not overwrite that.
 */
const RAMP_ALIAS = /^primary-\d+$/;

/**
 * Semantic tokens whose dark value is deliberately the same as their light one,
 * and why. Adding a token here is a decision; leaving one out is a bug.
 */
const INTENTIONALLY_LIGHT_ONLY: Readonly<Record<string, string>> = {
  // Fixed-hue fills. A saturated accent reads well on a dark surface as-is,
  // and flipping the fill would invalidate the `text-on-*` foreground that is
  // paired with it — see the entries below.
  "interactive-danger": "fixed-hue fill, reads on both themes",
  "interactive-danger-hover": "fixed-hue fill, reads on both themes",
  "interactive-danger-active": "fixed-hue fill, reads on both themes",
  "interactive-danger-hover-subtle": "fixed-hue fill, reads on both themes",
  "interactive-success": "fixed-hue fill, reads on both themes",
  "interactive-success-hover": "fixed-hue fill, reads on both themes",
  "interactive-success-active": "fixed-hue fill, reads on both themes",
  "interactive-success-hover-subtle": "fixed-hue fill, reads on both themes",
  "interactive-warning": "fixed-hue fill, reads on both themes",
  "interactive-warning-hover": "fixed-hue fill, reads on both themes",
  "interactive-warning-active": "fixed-hue fill, reads on both themes",
  "interactive-warning-hover-subtle": "fixed-hue fill, reads on both themes",
  "interactive-info": "fixed-hue fill, reads on both themes",
  "interactive-info-hover": "fixed-hue fill, reads on both themes",
  "interactive-info-active": "fixed-hue fill, reads on both themes",
  "interactive-info-hover-subtle": "fixed-hue fill, reads on both themes",

  // Foregrounds for those fills. They must not flip while the fill stays put:
  // a foreground that flipped landed near-white on bright amber at 1.67:1.
  "text-on-danger": "foreground for a fill that does not flip",
  "text-on-success": "foreground for a fill that does not flip",
  "text-on-info": "foreground for a fill that does not flip",
  "text-on-warning": "foreground for a fill that does not flip",

  // Both sit on the middle of the neutral ramp, which is the one place a value
  // reads on either extreme: `neutral-500` is 4.51:1 on white and 4.09:1 on the
  // dark surface. Flipping a mid-scale value moves it toward one theme and away
  // from the other. Both were already written into the dark theme at the same
  // value as the light one; the check that only looked for presence could not
  // tell that apart from a decision, and this one can.
  "text-muted": "mid-ramp, reads on both extremes",
  "interactive-primary-muted": "mid-ramp, reads on both extremes",

  // Resolves to `success-400`: 5.96:1 on the dark surface, but 3.09:1 on white.
  // No component paints text with it any more — `StockQuantityStatus` moved its
  // "normal" state to `feedback-success` — and it stays exported only because
  // removing a published token is breaking. A dark override would give a
  // retired token a second value rather than fix anything.
  "feedback-success-muted": "retired, not used as a text color",
};

const LIGHT = semanticTokens(readCss("token.css"));
const DARK = declaredTokens(readCss("theme-dark.css"));

describe("A dark value that equals its light value says so on purpose", () => {
  const semantic = [...LIGHT.keys()].filter((name) => !RAMP_ALIAS.test(name));

  it("finds semantic tokens to check", () => {
    expect(semantic.length).toBeGreaterThan(50);
  });

  it("every semantic token declares a dark value", () => {
    // Guaranteed by the generator now, which rejects a token missing a mode its
    // collection declares. Asserted anyway: it is the property the rest of this
    // file rests on, and it used to be false.
    expect(semantic.filter((name) => !DARK.has(name))).toEqual([]);
  });

  it.each(semantic)("%s", (name) => {
    const moved = LIGHT.get(name) !== DARK.get(name);
    const listed = name in INTENTIONALLY_LIGHT_ONLY;
    expect(
      moved || listed,
      `--cocso-color-${name} resolves to the same value in both themes. Either give it a dark value, or add it to INTENTIONALLY_LIGHT_ONLY with the reason.`
    ).toBe(true);
  });

  it("has no stale entries in the allowlist", () => {
    const stale = Object.keys(INTENTIONALLY_LIGHT_ONLY).filter(
      (name) => !LIGHT.has(name) || LIGHT.get(name) !== DARK.get(name)
    );
    expect(stale).toEqual([]);
  });
});
