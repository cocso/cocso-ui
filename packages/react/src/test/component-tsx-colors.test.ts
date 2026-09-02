/**
 * Component TSX color guard
 *
 * `module-css-tokens.test.ts` stops a CSS Module hardcoding a value the dark
 * theme is supposed to replace. Nothing said the same about the components
 * themselves, and the same defect kept appearing there instead — in an inline
 * style or an SVG attribute, where it is also unreachable from a consumer's
 * stylesheet:
 *
 * - Checkbox pinned its glyph to `colors.white` while its fill is
 *   `interactive-primary`, which the dark theme flips to a near-white. White on
 *   near-white is 1.09:1: a checked box and an unchecked one looked the same.
 * - Switch pinned its unchecked track to `colors.neutral100`, so the track
 *   stayed bright on a dark page.
 * - StockQuantityStatus wrote `fill="#D9D9D9"` into its SVG six times, which is
 *   a light grey track that survived the theme flip.
 *
 * All three were found by eye, one of them by a consumer. So: a component may
 * name a semantic token, and nothing else. `colors.textOnPrimary` is fine;
 * `colors.neutral100`, `colors.white` and a literal are not.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");

/**
 * Raw scale entries on the `colors` export. The numbered ramps plus bare
 * `white`/`black` keep their value when the theme flips — that is deliberate,
 * so a consumer's ramp override survives — which is exactly why a component
 * must not paint with one.
 *
 * Alpha variants are excluded for the same reason `module-css-tokens.test.ts`
 * excludes them: a translucent scrim like `blackAlpha30` is a fixed effect, not
 * a themed surface.
 */
const RAMP_REFERENCE =
  /\bcolors\.((?:neutral|primary|danger|warning|success|info)\d+|white|black)\b/g;

/**
 * A colour written out rather than referenced: `#fff`, `#D9D9D9`, `rgb(...)`,
 * `rgba(...)`. Anchored to an attribute or property so a hex inside SVG path
 * data or a class name does not register.
 */
const COLOR_LITERAL =
  /(?:fill|stroke|color|background|backgroundColor|borderColor|stopColor)\s*[=:]\s*["'{\s]*(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\))/g;

function componentFiles(): string[] {
  const files: string[] = [];
  for (const dir of readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    for (const entry of readdirSync(join(COMPONENTS_DIR, dir.name))) {
      if (
        entry.endsWith(".tsx") &&
        !entry.endsWith(".stories.tsx") &&
        !entry.endsWith(".test.tsx")
      ) {
        files.push(`${dir.name}/${entry}`);
      }
    }
  }
  return files.sort();
}

/**
 * Strip comments before scanning. A comment explaining why a component stopped
 * using `colors.white` names `colors.white`, and the first version of this
 * guard failed on its own documentation.
 */
function withoutComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function offendersIn(relativePath: string): string[] {
  const source = withoutComments(
    readFileSync(join(COMPONENTS_DIR, relativePath), "utf-8")
  );
  return [
    ...[...source.matchAll(RAMP_REFERENCE)].map(
      (match) => `colors.${match[1]}`
    ),
    ...[...source.matchAll(COLOR_LITERAL)].map((match) => match[1]),
  ];
}

describe("Components do not paint with raw ramp values or colour literals", () => {
  const files = componentFiles();

  it("finds the components to check", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)("%s", (file) => {
    expect(
      offendersIn(file),
      `${file} names a colour the dark theme will not replace. Use the semantic token for the role — a fill's foreground is \`text-on-*\`, a quiet surface is \`surface-neutral\` — and add it to \`colors\` in src/token/color.ts if it is not exported yet. A value written here is also unreachable from a consumer's stylesheet.`
    ).toEqual([]);
  });
});
