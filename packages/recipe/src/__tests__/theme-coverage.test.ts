/**
 * Dark theme coverage — a token that does not move said so on purpose
 *
 * The generator requires every token in the `theme` collection to declare both
 * a light and a dark value, so "a semantic token with no dark value" is not
 * expressible any more. That closes the hole the `feedback-*` bases fell
 * through, where the absence of a value was indistinguishable from a decision.
 *
 * What it does not close is the other half: a dark value written to equal the
 * light one. That is correct for the fixed-hue `interactive-*` fills and their
 * `text-on-*` foregrounds, and a defect for anything else — and the two look
 * identical in the source.
 *
 * So the reason has to be written down, and it is written down where the value
 * is: a `# same-in-both:` comment on the token in the YAML. This reads those
 * rather than keeping a second list here, because a list here is a copy that
 * goes stale, and because the source is what a person edits when they add a
 * token. Generating `theme-dark.css` moved the rationale out of the published
 * file; this is what keeps it attached to something.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const CSS_DIR = join(import.meta.dirname, "..", "..", "..", "css");
const SOURCE = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "baseframe-sources",
  "semantic",
  "color.yaml"
);

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
 * Tokens carrying a `# same-in-both:` comment in the source, mapped to the
 * reason given.
 */
function documentedReasons(): Map<string, string> {
  const yaml = readFileSync(SOURCE, "utf-8");
  const found = new Map<string, string>();
  for (const [, reason, token] of yaml.matchAll(
    /# same-in-both:\s*(.+)\n\s*\$color\.([a-z0-9.-]+):/g
  )) {
    found.set(token.replace(/\./g, "-"), reason.trim());
  }
  return found;
}

/**
 * `primary-*` aliases the neutral ramp, which makes it look semantic by the
 * rule above. It is the documented theming entry point: a consumer redefines
 * it in their own `:root` and the dark theme must not overwrite it.
 */
const RAMP_ALIAS = /^primary-\d+$/;

const LIGHT = semanticTokens(readCss("token.css"));
const DARK = declaredTokens(readCss("theme-dark.css"));
const REASONS = documentedReasons();

describe("A dark value that equals its light value says so on purpose", () => {
  const semantic = [...LIGHT.keys()].filter((name) => !RAMP_ALIAS.test(name));

  it("finds semantic tokens to check", () => {
    expect(semantic.length).toBeGreaterThan(50);
  });

  it("finds documented reasons in the source", () => {
    expect(REASONS.size).toBeGreaterThan(10);
  });

  it("every semantic token declares a dark value", () => {
    // Guaranteed by the generator, which rejects a token missing a mode its
    // collection declares. Asserted anyway: it is the property the rest of this
    // file rests on, and it used to be false.
    expect(semantic.filter((name) => !DARK.has(name))).toEqual([]);
  });

  it.each(semantic)("%s", (name) => {
    const moved = LIGHT.get(name) !== DARK.get(name);
    expect(
      moved || REASONS.has(name),
      `--cocso-color-${name} resolves to the same value in both themes. Either give it a dark value, or write a "# same-in-both: <reason>" comment above it in packages/baseframe-sources/semantic/color.yaml.`
    ).toBe(true);
  });

  it("has no reason attached to a token that does move", () => {
    const stale = [...REASONS.keys()].filter(
      (name) =>
        LIGHT.has(name) && DARK.has(name) && LIGHT.get(name) !== DARK.get(name)
    );
    expect(
      stale,
      'these carry a "# same-in-both" comment but their two modes differ'
    ).toEqual([]);
  });
});
