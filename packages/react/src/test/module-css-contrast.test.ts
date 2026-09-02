/**
 * CSS Module foreground contrast
 *
 * `contrast.test.ts` in `@cocso-ui/recipe` resolves every recipe through both
 * themes, but a recipe is only half of a component. The other half is its CSS
 * Module, and nothing looked at those at all — which is how two defects sat in
 * plain sight:
 *
 * - `field.module.css` painted validation messages with `feedback-danger`, the
 *   fill level, at 4.18:1 on `surface-secondary` in the light theme. Twelve
 *   pixel text, and the text a user most needs to read, below AA on any card.
 * - `day-picker.module.css` used `surface-primary` as the foreground on an
 *   `interactive-primary` fill. It reads correctly in the stock themes by
 *   coincidence — the two flip in opposite directions — but the pair a
 *   consumer rebrands is `interactive-primary`/`text-on-primary`, so a
 *   rebranded fill left the foreground tracking the page: 3.23:1.
 *
 * This checks the foregrounds a module states outright. A module that paints
 * with a component custom property is covered by the recipe test instead; one
 * that names a semantic token directly is only covered here.
 *
 * `color` only, not `fill` or `stroke`. Those paint non-text graphics, which
 * WCAG 1.4.11 asks 3:1 of and only when the graphic carries meaning — and
 * whether it does is a fact about the markup, not the stylesheet. The
 * StockQuantityStatus capsule is the case in point: its unfilled track is
 * `surface-neutral` at 1.23:1 against the page, which is correct for the quiet
 * trough behind a status colour, on an `aria-hidden` SVG whose meaning is
 * carried by the label beside it. Judging that from CSS alone would only
 * produce a wrong answer confidently.
 *
 * A foreground is measured against the `background-color` its own rule block
 * declares, and only against the page surfaces when the block declares none —
 * the same model the recipe test uses. Checking a foreground meant for a fill
 * against the page is how `text-on-primary` would look like a defect.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");
const CSS_DIR = join(import.meta.dirname, "..", "..", "..", "css");

/** WCAG 2.2 SC 1.4.3, normal text. */
const AA_NORMAL_TEXT = 4.5;

function parseTokens(file: string) {
  const css = readFileSync(join(CSS_DIR, file), "utf-8");
  const primitives = new Map<string, string>();
  const aliases = new Map<string, string>();
  for (const [, name, value] of css.matchAll(
    /--cocso-color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g
  )) {
    primitives.set(name, value);
  }
  for (const [, name, target] of css.matchAll(
    /--cocso-color-([a-z0-9-]+):\s*var\(--cocso-color-([a-z0-9-]+)\);/g
  )) {
    aliases.set(name, target);
  }
  return { primitives, aliases };
}

const light = parseTokens("token.css");
const dark = parseTokens("theme-dark.css");

const PRIMITIVES = new Map(light.primitives);
PRIMITIVES.set("white", "#ffffff");
PRIMITIVES.set("black", "#000000");

const THEMES: [string, Map<string, string>][] = [
  ["light", light.aliases],
  ["dark", new Map([...light.aliases, ...dark.aliases])],
];

function resolve(
  token: string,
  aliases: Map<string, string>,
  depth = 0
): string | null {
  if (depth > 8) {
    return null;
  }
  const primitive = PRIMITIVES.get(token);
  if (primitive) {
    return primitive;
  }
  const alias = aliases.get(token);
  return alias ? resolve(alias, aliases, depth + 1) : null;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Surfaces text actually lands on. The page and the cards, plus the tints a
 * component paints and then writes on — an Alert's panel, a Badge's pill, a
 * subtle button's fill. `interactive-primary-subtle` is `neutral-100` and the
 * worst of them, which is why the page-and-card view understated the light
 * theme's floor.
 */
const SURFACES = [
  "surface-primary",
  "surface-secondary",
  "interactive-primary-subtle",
  "feedback-danger-subtle",
  "feedback-success-subtle",
  "feedback-warning-subtle",
  "feedback-info-subtle",
] as const;

/**
 * Tokens exempt wherever they appear, because of what the token is for.
 */
const EXEMPT_TOKENS: Readonly<Record<string, string>> = {
  // WCAG 1.4.3 excludes inactive components.
  "text-disabled": "disabled text is exempt under WCAG 1.4.3",
};

/**
 * Individual uses that are exempt, keyed by `<file>:<token>`.
 *
 * `text-tertiary` and `text-muted` were exempt by token, which was too broad:
 * AGENTS.md forbids them for body text precisely because neither clears AA on
 * any surface, so a blanket exemption turned the rule off for the check that
 * was supposed to enforce it. They are legitimate for non-text graphics, and
 * both current uses are exactly that — but the next one has to justify itself
 * rather than inherit the exemption.
 */
const EXEMPT_USES: Readonly<Record<string, string>> = {
  "breadcrumb/breadcrumb.module.css:text-tertiary":
    "the separator glyph — `aria-hidden`, and the list structure carries the hierarchy",
  "select/select.module.css:text-muted":
    "the chevron, a non-text graphic; WCAG 1.4.11 asks 3:1 and it clears that on every surface",
};

function isExempt(declaration: { file: string; token: string }): boolean {
  const { file, token } = declaration;
  return token in EXEMPT_TOKENS || `${file}:${token}` in EXEMPT_USES;
}

interface Declaration {
  /** The fill declared alongside it, if the same rule block declares one. */
  background?: string;
  file: string;
  line: number;
  token: string;
}

const FOREGROUND = /^\s*color:\s*var\(--cocso-color-([a-z0-9-]+)\)/;
const BACKGROUND =
  /^\s*background(?:-color)?:\s*var\(--cocso-color-([a-z0-9-]+)\)/;

/**
 * Walk a module a rule block at a time, pairing each foreground with the fill
 * its own block declares. A brace on either side closes whatever was being
 * collected, so a declaration is only ever paired with the block it is in.
 */
function declarationsIn(file: string, css: string): Declaration[] {
  const found: Declaration[] = [];
  const lines = css.split("\n");

  let foregrounds: Declaration[] = [];
  let background: string | undefined;

  const flush = () => {
    for (const declaration of foregrounds) {
      found.push({ ...declaration, background });
    }
    foregrounds = [];
    background = undefined;
  };

  lines.forEach((text, index) => {
    if (text.includes("{")) {
      flush();
      return;
    }
    if (text.includes("}")) {
      flush();
      return;
    }
    const foreground = text.match(FOREGROUND);
    if (foreground) {
      foregrounds.push({ file, line: index + 1, token: foreground[1] });
      return;
    }
    const fill = text.match(BACKGROUND);
    if (fill) {
      background = fill[1];
    }
  });
  flush();
  return found;
}

function foregroundDeclarations(): Declaration[] {
  const found: Declaration[] = [];
  for (const dir of readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    for (const entry of readdirSync(join(COMPONENTS_DIR, dir.name))) {
      if (!entry.endsWith(".module.css")) {
        continue;
      }
      found.push(
        ...declarationsIn(
          `${dir.name}/${entry}`,
          readFileSync(join(COMPONENTS_DIR, dir.name, entry), "utf-8")
        )
      );
    }
  }
  return found;
}

const DECLARATIONS = foregroundDeclarations();

describe("CSS Module foregrounds clear AA on the surfaces they sit on", () => {
  it("finds foreground declarations to check", () => {
    expect(DECLARATIONS.length).toBeGreaterThan(10);
  });

  const cases = DECLARATIONS.filter(
    (declaration) => !isExempt(declaration)
  ).flatMap((declaration) =>
    THEMES.flatMap(([theme, aliases]) =>
      (declaration.background ? [declaration.background] : [...SURFACES]).map(
        (surface) => ({ ...declaration, theme, aliases, surface })
      )
    )
  );

  it.each(cases)("$file:$line $token on $surface ($theme)", ({
    token,
    surface,
    aliases,
    file,
    line,
  }) => {
    const foreground = resolve(token, aliases);
    const background = resolve(surface, aliases);
    if (!(foreground && background)) {
      return;
    }
    expect(
      contrast(background, foreground),
      `${file}:${line} paints text with \`${token}\`, which is below AA on \`${surface}\`. Use the text-level token for that role, or add it to EXEMPT with the reason.`
    ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});
