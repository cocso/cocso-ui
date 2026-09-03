import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import {
  buildValidatedAst,
  type Collections,
  cssVars,
  type Token,
  tailwind,
} from "../core";
import { findYamlFiles } from "../utils/fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../../");
const SOURCES_DIR = path.join(REPO_ROOT, "packages/baseframe-sources");
const SNAPSHOTS_DIR = path.join(__dirname, "snapshots");
const CSS_DIR = path.join(REPO_ROOT, "packages/css");

const REGENERATE = "pnpm --filter @cocso-ui/baseframe generate:css";

function loadTokens(): { tokens: Token[]; collections: Collections } {
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
  return { tokens, collections };
}

/**
 * The AST split the generate script uses. `token.css` carries the primitives
 * and the light theme; `theme-dark.css` carries the same semantic tokens in
 * their dark mode and nothing else, so a consumer's ramp override survives the
 * flip.
 */
function astFor(
  tokens: Token[],
  collections: Collections,
  wanted: Record<string, string[]>
) {
  const ast = buildValidatedAst(tokens, collections);
  return {
    ...ast,
    collections: ast.collections
      .filter((collection) => collection.name in wanted)
      .map((collection) => ({
        ...collection,
        modes: wanted[collection.name],
      })),
  };
}

const LIGHT_SELECTORS = {
  global: { default: ":root" },
  theme: { light: ":root" },
};
const DARK_SELECTORS = { theme: { dark: '[data-theme="dark"]' } };

describe("golden file tests", () => {
  it("token.css matches snapshot", () => {
    const { tokens, collections } = loadTokens();
    const generated = cssVars.generateFromAst(
      astFor(tokens, collections, { global: ["default"], theme: ["light"] }),
      { prefix: "cocso", selectors: LIGHT_SELECTORS }
    );
    const expected = fs.readFileSync(
      path.join(SNAPSHOTS_DIR, "token.css.expected"),
      "utf-8"
    );
    expect(generated).toBe(expected);
  });

  it("theme-dark.css matches snapshot", () => {
    const { tokens, collections } = loadTokens();
    const generated = cssVars.generateFromAst(
      astFor(tokens, collections, { theme: ["dark"] }),
      { prefix: "cocso", selectors: DARK_SELECTORS }
    );
    const expected = fs.readFileSync(
      path.join(SNAPSHOTS_DIR, "theme-dark.css.expected"),
      "utf-8"
    );
    expect(expected).toContain(generated.trimStart());
  });

  it("tailwind4.css matches snapshot", () => {
    const { tokens, collections } = loadTokens();
    const generated = tailwind.generateTailwindCSS(tokens, collections, {});
    const expected = fs.readFileSync(
      path.join(SNAPSHOTS_DIR, "tailwind4.css.expected"),
      "utf-8"
    );
    expect(generated).toBe(expected);
  });
});

/**
 * `packages/css/token.css` and `tailwind4.css` are published, but they are not
 * written by hand — they are this generator's output, and nothing checked that.
 * Twelve semantic tokens (`border-strong`, `text-on-success` and friends) were
 * added to `token.css` directly and never made it back into the YAML, so they
 * were missing from `tailwind4.css` and from the Figma token export, which
 * reads the YAML. The snapshot tests above cannot catch that: they compare the
 * generator to a fixture, and both stayed consistent while the published file
 * drifted away from them.
 */
describe("published CSS matches the token sources", () => {
  it(`token.css is generated from packages/baseframe-sources (${REGENERATE})`, () => {
    const { tokens, collections } = loadTokens();
    const generated = cssVars.generateFromAst(
      astFor(tokens, collections, { global: ["default"], theme: ["light"] }),
      { prefix: "cocso", selectors: LIGHT_SELECTORS }
    );
    const published = fs.readFileSync(path.join(CSS_DIR, "token.css"), "utf-8");
    expect(published).toBe(generated);
  });

  it(`theme-dark.css is generated from packages/baseframe-sources (${REGENERATE})`, () => {
    const { tokens, collections } = loadTokens();
    const generated = cssVars.generateFromAst(
      astFor(tokens, collections, { theme: ["dark"] }),
      { prefix: "cocso", selectors: DARK_SELECTORS }
    );
    const published = fs.readFileSync(
      path.join(CSS_DIR, "theme-dark.css"),
      "utf-8"
    );
    // The banner is written by the generate script, not the generator.
    expect(published).toContain(generated.trimStart());
  });

  it(`tailwind4.css is generated from packages/baseframe-sources (${REGENERATE})`, () => {
    const { tokens, collections } = loadTokens();
    const generated = tailwind.generateTailwindCSS(tokens, collections, {});
    const published = fs.readFileSync(
      path.join(CSS_DIR, "tailwind4.css"),
      "utf-8"
    );
    expect(published).toBe(generated);
  });
});
