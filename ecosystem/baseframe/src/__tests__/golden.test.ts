import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { type Collections, cssVars, type Token, tailwind } from "../core";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../../");
const SOURCES_DIR = path.join(REPO_ROOT, "packages/baseframe");
const SNAPSHOTS_DIR = path.join(__dirname, "snapshots");

const YAML_FILE_REGEX = /\.ya?ml$/;

function findYamlFiles(dir: string): string[] {
  const files: string[] = [];
  function scan(current: string) {
    for (const item of fs.readdirSync(current)) {
      const full = path.join(current, item);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (YAML_FILE_REGEX.test(item)) {
        files.push(full);
      }
    }
  }
  scan(dir);
  return files;
}

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

describe("golden file tests", () => {
  // Differences recorded between old generator output and current check-in CSS:
  // 1. Hex case: YAML '#FFFFFF' → was uppercase, now normalized to lowercase
  // 2. Shadow formatting: single-line vs multi-line in old check-in
  // 3. Token ordering: generator order (primitive → semantic) vs manual order
  // 4. font-weight tokens: now sourced from primitive/font-weight.yaml
  // 5. tailwind4.css: 2-layer pattern (--color-*: var(--cocso-color-*)) vs old direct values
  // 6. tailwind4.css: @utility count reduced to 1 (z-* only)
  // 7. tailwind4.css: $number.1 dead code removed
  // 8. tailwind4.css: semantic color tokens included in @theme

  it("token.css matches snapshot", () => {
    const { tokens, collections } = loadTokens();
    const generated = cssVars.generateCssVariables(tokens, collections, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    const expected = fs.readFileSync(
      path.join(SNAPSHOTS_DIR, "token.css.expected"),
      "utf-8"
    );
    expect(generated).toBe(expected);
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
