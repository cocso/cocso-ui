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
const output = mobile.generateMobileFromAst(ast);

/** Every `let name` / `func name(` in the Swift, per enum. */
function swiftNames(source: string): Set<string> {
  return new Set([
    ...[...source.matchAll(/public static let (\w+)/g)].map(([, n]) => n),
    ...[...source.matchAll(/public static func (\w+)\(/g)].map(([, n]) => n),
  ]);
}

function kotlinNames(source: string): Set<string> {
  return new Set([
    ...[...source.matchAll(/^\s+val (\w+):/gm)].map(([, n]) => n),
    ...[...source.matchAll(/^\s+fun (\w+)\(\):/gm)].map(([, n]) => n),
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

const SWIFT_TEXT_PRIMARY =
  /public static func textPrimary\(_ scheme: ColorScheme\) -> SwiftUI\.Color \{\n(.+)\n/;
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

describe("The published files are what the generator produces", () => {
  it(`CocsoTokens.swift is generated (${REGENERATE})`, () => {
    expect(fs.readFileSync(SWIFT_FILE, "utf-8")).toBe(output.swift);
  });

  it(`CocsoTokens.kt is generated (${REGENERATE})`, () => {
    expect(fs.readFileSync(KOTLIN_FILE, "utf-8")).toBe(output.kotlin);
  });
});
