/**
 * Dark theme coverage — every semantic color token is accounted for
 *
 * `theme-dark.css` is hand-written, and nothing checked that it kept up with
 * `token.css`. A semantic token added to the light theme simply had no dark
 * value, and the only way to notice was to look at it in a dark browser: the
 * four `feedback-*` base colors sat on the light theme's 500 level for as long
 * as the dark theme existed, 3.96–4.05:1 on the dark surface, under AA.
 *
 * Leaving a token alone is often correct — the fixed-hue `interactive-*` fills
 * and their `text-on-*` foregrounds are deliberate, and `theme-dark.css` says
 * so in its header. What was missing is the distinction between "decided to
 * leave it" and "never noticed it". This test draws that line: a semantic
 * token either has a dark value, or it is listed below with the reason.
 *
 * "Semantic" is mechanical — the token's value in `token.css` is a
 * `var(--cocso-color-*)` reference to another token. Raw ramp entries are
 * literals and are deliberately not redefined by the dark theme, so an app
 * override of a ramp survives the theme flip.
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

function declaredTokens(css: string): Set<string> {
  return new Set(
    [...css.matchAll(/--cocso-color-([a-z0-9-]+):/g)].map(([, name]) => name)
  );
}

/**
 * `primary-*` aliases the neutral ramp, which makes it look semantic by the
 * rule above. It is the documented theming entry point: a consumer redefines
 * it in their own `:root` and the dark theme must not overwrite that.
 */
const RAMP_ALIAS = /^primary-\d+$/;

/**
 * Semantic tokens the dark theme deliberately does not redefine, and why.
 * Adding a token here is a decision; leaving one out is a bug.
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

  // Resolves to `success-400`: 5.96:1 on the dark surface, but 3.09:1 on white.
  // No component paints text with it any more — `StockQuantityStatus` moved its
  // "normal" state to `feedback-success` — and it stays exported only because
  // removing a published token is breaking. A dark override would give a
  // retired token a second value rather than fix anything.
  "feedback-success-muted": "retired, not used as a text color",
};

const LIGHT = semanticTokens(readCss("token.css"));
const DARK = declaredTokens(readCss("theme-dark.css"));

describe("Dark theme covers every semantic color token", () => {
  const semantic = [...LIGHT.keys()].filter((name) => !RAMP_ALIAS.test(name));

  it("finds semantic tokens to check", () => {
    expect(semantic.length).toBeGreaterThan(50);
  });

  it.each(
    semantic
  )("%s has a dark value or a documented reason not to", (name) => {
    const covered = DARK.has(name) || name in INTENTIONALLY_LIGHT_ONLY;
    expect(
      covered,
      `--cocso-color-${name} has no value in theme-dark.css. Either give it one, or add it to INTENTIONALLY_LIGHT_ONLY with the reason.`
    ).toBe(true);
  });

  it("has no stale entries in the allowlist", () => {
    const stale = Object.keys(INTENTIONALLY_LIGHT_ONLY).filter(
      (name) => DARK.has(name) || !LIGHT.has(name)
    );
    expect(stale).toEqual([]);
  });
});
