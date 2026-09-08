/**
 * The mobile token artifacts, against the source and against each other.
 *
 * `cocso/mobile` had a converter that read the YAML directly. When the semantic
 * colours moved from one mode to two it did not fail — it kept reading
 * `values.default`, found nothing, and emitted four colours instead of
 * fifty-nine. Nothing compared the output to the source, so nobody knew for a
 * day.
 *
 * These are the comparisons that were missing: the two platforms carry the same
 * token names, those names match the CSS, a themed token actually differs
 * between the themes, and the published files are what the generator produces.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import {
  buildValidatedAst,
  type Collections,
  mobile,
  type Token,
} from "../core";
import { findYamlFiles } from "../utils/fs";
// The published files carry the brand axis, so the comparison has to emit it too.
import { brandOverrides, brandResolved } from "../../scripts/generate-brand";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../../");
const SOURCES_DIR = path.join(REPO_ROOT, "packages/baseframe-sources");
const SWIFT_FILE = path.join(
  REPO_ROOT,
  "packages/swiftui/Sources/CocsoUI/CocsoTokens.swift"
);
const KOTLIN_FILE = path.join(
  REPO_ROOT,
  "packages/compose/src/main/kotlin/ai/cocso/ui/CocsoTokens.kt"
);
const JSON_FILE = path.join(REPO_ROOT, "packages/css/tokens.json");
const REGENERATE = "pnpm --filter @cocso-ui/baseframe generate:mobile";

function loadTokens(): { collections: Collections; tokens: Token[] } {
  const tokens: Token[] = [];
  let collections: Collections | null = null;
  for (const filePath of findYamlFiles(SOURCES_DIR)) {
    const parsed = YAML.parse(fs.readFileSync(filePath, "utf-8"));
    if (parsed.kind === "Tokens") {
      tokens.push(parsed);
    } else if (parsed.kind === "TokenCollections") {
      collections = parsed;
    }
  }
  if (!collections) {
    throw new Error("collections.yaml not found");
  }
  return { collections, tokens };
}

const { collections, tokens } = loadTokens();
const ast = buildValidatedAst(tokens, collections);
const output = mobile.generateMobileFromAst(ast, { brands: brandOverrides() });
const json = mobile.generateTokensJson(ast, { brands: brandResolved() });

/** Every `let name` / `func name(` in the Swift, per enum. */
function swiftNames(source: string): Set<string> {
  return new Set([
    ...[...source.matchAll(/public static let (\w+)/g)].map(([, n]) => n),
    // `$easing.default` collides with a Swift keyword and is backticked.
    ...[...source.matchAll(/public static func `?(\w+)`?\(/g)].map(
      ([, n]) => n
    ),
  ]);
}

function kotlinNames(source: string): Set<string> {
  return new Set([
    // Eight spaces: a token inside an object. `CocsoShadowLayer`'s fields sit
    // at four and are not tokens.
    ...[...source.matchAll(/^ {8}val (\w+):/gm)].map(([, n]) => n),
    ...[...source.matchAll(/^ {8}fun (\w+)\(\):/gm)].map(([, n]) => n),
  ]);
}

describe("The two platforms carry the same tokens", () => {
  const swift = swiftNames(output.swift);
  const kotlin = kotlinNames(output.kotlin);

  it("emits a meaningful number of tokens", () => {
    // A floor, not a count. The failure this guards is the artifact quietly
    // shrinking, which is exactly what happened downstream.
    expect(swift.size).toBeGreaterThan(100);
  });

  it("has no token in Swift that Kotlin lacks", () => {
    expect([...swift].filter((n) => !kotlin.has(n)).sort()).toEqual([]);
  });

  it("has no token in Kotlin that Swift lacks", () => {
    expect([...kotlin].filter((n) => !swift.has(n)).sort()).toEqual([]);
  });
});

const CSS_NAME = /^([a-z]+(?:-[a-z]+)*?)-(.+)$/;
const LEADING_DIGIT = /^\d/;
const CSS_COLOR_DECL = /--cocso-color-([a-z0-9-]+):/g;
const COLOR_PREFIX = /^\$color\./;
const SEMANTIC_GROUP =
  /^(text|surface|border|overlay|interactive|feedback|focus|alpha)-/;

describe("The mobile tokens match the CSS", () => {
  /** `--cocso-color-text-on-primary` → `textOnPrimary`, `--cocso-spacing-4` → `s4`. */
  function identifierFor(cssName: string): string | null {
    const match = cssName.match(CSS_NAME);
    if (!match) {
      return null;
    }
    const [, group, rest] = match;
    const parts = rest.split("-");
    let ident =
      parts[0] +
      parts
        .slice(1)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
    if (LEADING_DIGIT.test(ident)) {
      ident = group[0] + ident;
    }
    return ident;
  }

  it("emits every colour the CSS does, except the ones it names", () => {
    const css = fs.readFileSync(
      path.join(REPO_ROOT, "packages/css/token.css"),
      "utf-8"
    );
    const cssColors = [
      ...new Set([...css.matchAll(CSS_COLOR_DECL)].map(([, n]) => n)),
    ];
    const skipped = new Set(
      output.skipped.map(({ name }) => name.replace(COLOR_PREFIX, ""))
    );
    const swift = swiftNames(output.swift);

    const missing = cssColors.filter((name) => {
      const dotted = name.replace(SEMANTIC_GROUP, "$1.");
      if (skipped.has(name) || skipped.has(dotted)) {
        return false;
      }
      const ident = identifierFor(`color-${name}`);
      return ident !== null && !swift.has(ident);
    });

    expect(
      missing,
      "these colours exist in the CSS but not in the mobile artifacts, and nothing said why"
    ).toEqual([]);
  });
});

// The signature carries a brand axis when brands exist (`, brand _: CocsoBrand = .base`).
const SWIFT_TEXT_PRIMARY =
  /public static func textPrimary\(_ scheme: ColorScheme(?:, brand _: CocsoBrand = \.base)?\) -> SwiftUI\.Color \{\n(.+)\n/;
const KOTLIN_TEXT_PRIMARY = /fun textPrimary\(\): ComposeColor =\n(.+)\n/;
const KOTLIN_NEUTRAL_500 = /val neutral500: ComposeColor/;

describe("A themed token resolves differently per theme", () => {
  it("gives text-primary two values in Swift", () => {
    const body = output.swift.match(SWIFT_TEXT_PRIMARY);
    expect(body).not.toBeNull();
    const [light, dark] = (body?.[1] ?? "").split(" : ");
    expect(light).not.toEqual(dark);
  });

  it("gives text-primary two values in Kotlin", () => {
    const body = output.kotlin.match(KOTLIN_TEXT_PRIMARY);
    expect(body).not.toBeNull();
    expect(body?.[1]).toContain("isSystemInDarkTheme()");
  });

  it("leaves a raw ramp entry as a constant on both platforms", () => {
    // The ramps are single-mode on purpose — that is what lets an app override
    // one and keep the override in both themes. Wrapping them in a scheme
    // parameter would hide that.
    expect(output.swift).toContain("public static let neutral500");
    expect(output.kotlin).toMatch(KOTLIN_NEUTRAL_500);
  });
});

const SWIFT_ENTRANCE =
  /public static func entrance\(_ duration: TimeInterval\) -> Animation \{\n\s+\.timingCurve\(0\.16, 1, 0\.3, 1, duration: duration\)/;
const KOTLIN_ENTRANCE =
  /val entrance: ComposeEasing = CubicBezierEasing\(0\.16f, 1f, 0\.3f, 1f\)/;
const KOTLIN_DURATION_BLOCK = /object Duration \{([\s\S]*?)\n {4}\}/;
const CSS_EASING_DECL = /--cocso-easing-([a-z-]+):/g;
const CSS_DURATION_DECL = /--cocso-duration-([a-z-]+):/g;
const MOTION_TOKEN = /^\$(easing|duration)\./;

/**
 * Motion crosses as what it is. A duration was emitted as a length —
 * `0.15.dp` on Compose, a `CGFloat` on SwiftUI — and an easing was refused as
 * "unsupported", so the web's `duration-fast` + `easing-default` reached
 * neither platform and each view hard-coded its own 800 and 1000.
 */
describe("Motion tokens are time and curves, not lengths", () => {
  it("emits a duration in seconds on Swift and milliseconds on Kotlin", () => {
    expect(output.swift).toContain(
      "public static let fast: TimeInterval = 0.15"
    );
    expect(output.kotlin).toContain("val fast: Int = 150");
    const duration = output.kotlin.match(KOTLIN_DURATION_BLOCK)?.[1] ?? "";
    expect(duration).not.toContain(".dp");
  });

  it("emits an easing as the platform's own curve", () => {
    expect(output.swift).toMatch(SWIFT_ENTRANCE);
    expect(output.kotlin).toMatch(KOTLIN_ENTRANCE);
  });

  it("carries every duration and easing the CSS has", () => {
    const css = fs.readFileSync(
      path.join(REPO_ROOT, "packages/css/token.css"),
      "utf-8"
    );
    const swift = swiftNames(output.swift);
    const kotlin = kotlinNames(output.kotlin);
    const names = [
      ...[...css.matchAll(CSS_EASING_DECL)].map(([, n]) => `easing-${n}`),
      ...[...css.matchAll(CSS_DURATION_DECL)].map(([, n]) => `duration-${n}`),
    ];
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      const ident = name
        .split("-")
        .slice(1)
        .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
        .join("");
      expect(swift.has(ident), `${name} missing from Swift`).toBe(true);
      expect(kotlin.has(ident), `${name} missing from Kotlin`).toBe(true);
    }
    expect(
      output.skipped.filter(({ name }) => MOTION_TOKEN.test(name))
    ).toEqual([]);
  });
});

const SWIFT_SHADOW_CARD =
  /public static func card\(_ scheme: ColorScheme(?:, brand _: CocsoBrand = \.base)?\) -> \[CocsoShadowLayer\] \{\n(.+)\n/;
const KOTLIN_SHADOW_CARD = /fun card\(\): List<CocsoShadowLayer> =\n(.+)\n/;
const SWIFT_LAYER = /CocsoShadowLayer\(x: 0, y: 4, blur: 8, spread: 0, color: SwiftUI\.Color\(hex: 0x000000, opacity: 0\.08\)\)/;
const CSS_TOKEN_DECL = /--cocso-([a-z0-9-]+):/g;

/**
 * Shadows cross as layers. `$shadow.sm` was refused as a composite for as long
 * as the emitter existed, so the elevated card — the variant whose meaning is
 * its shadow — was a flat rectangle on both platforms. And they are themed:
 * the layers name `$color.alpha.shadow*`, which the dark theme deepens, even
 * though the shadow tokens live in the single-mode collection.
 */
describe("Shadows cross as layers, per theme", () => {
  it("emits shadow-card as a themed list of layers on both platforms", () => {
    const swift = output.swift.match(SWIFT_SHADOW_CARD);
    expect(swift).not.toBeNull();
    const [light, dark] = (swift?.[1] ?? "").split(" : ");
    expect(light).not.toEqual(dark);
    expect(output.swift).toMatch(SWIFT_LAYER);
    const kotlin = output.kotlin.match(KOTLIN_SHADOW_CARD);
    expect(kotlin?.[1]).toContain("isSystemInDarkTheme()");
    expect(kotlin?.[1]).toContain("CocsoShadowLayer(x = 0.dp, y = 4.dp, blur = 8.dp");
  });

  it("skips nothing but transparent", () => {
    expect(output.skipped.map(({ name }) => name)).toEqual(["$color.transparent"]);
  });
});

/**
 * The JSON artifact: the same resolution as data. `cocso/mobile` parsed the
 * Swift with regular expressions and had to follow every signature change;
 * a consumer that is a program reads this instead.
 */
describe("tokens.json carries every token, every mode, every brand", () => {
  const data = JSON.parse(json) as {
    brands: string[];
    skipped: { name: string }[];
    tokens: Record<
      string,
      { css: string; identifier: string; values: Record<string, unknown>; brands?: Record<string, unknown> }
    >;
  };

  it("names every CSS custom property token.css declares", () => {
    const css = fs.readFileSync(path.join(REPO_ROOT, "packages/css/token.css"), "utf-8");
    const declared = new Set([...css.matchAll(CSS_TOKEN_DECL)].map(([, n]) => `--cocso-${n}`));
    const inJson = new Set(Object.values(data.tokens).map((t) => t.css));
    const skipped = new Set(
      data.skipped.map(({ name }) => `--cocso-${name.replace(COLOR_PREFIX, "color-").replace(/\./g, "-")}`)
    );
    expect(
      [...declared].filter((c) => !(inJson.has(c) || skipped.has(c)))
    ).toEqual([]);
  });

  it("uses the identifiers the Swift and Kotlin use", () => {
    const swift = swiftNames(output.swift);
    for (const token of Object.values(data.tokens)) {
      expect(swift.has(token.identifier), token.identifier).toBe(true);
    }
  });

  it("carries the brand overrides inline", () => {
    expect(data.brands).toEqual(["cocso"]);
    const primary = data.tokens["$color.interactive.primary"];
    expect(primary.brands?.cocso).toBeDefined();
    expect(data.tokens["$color.text.primary"].brands).toBeUndefined();
    expect(Object.keys(primary.values).sort()).toEqual(["dark", "light"]);
  });

  it("is deterministic", () => {
    expect(mobile.generateTokensJson(ast, { brands: brandResolved() })).toBe(json);
  });
});

describe("The published files are what the generator produces", () => {
  it(`tokens.json is generated (${REGENERATE})`, () => {
    expect(fs.readFileSync(JSON_FILE, "utf-8")).toBe(json);
  });

  it(`CocsoTokens.swift is generated (${REGENERATE})`, () => {
    expect(fs.readFileSync(SWIFT_FILE, "utf-8")).toBe(output.swift);
  });

  it(`CocsoTokens.kt is generated (${REGENERATE})`, () => {
    expect(fs.readFileSync(KOTLIN_FILE, "utf-8")).toBe(output.kotlin);
  });
});
