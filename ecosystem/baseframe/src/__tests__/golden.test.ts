import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { type Collections, cssVars, type Token, tailwind } from "../core";
import { findYamlFiles } from "../utils/fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../../");
const SOURCES_DIR = path.join(REPO_ROOT, "packages/baseframe-sources");
const SNAPSHOTS_DIR = path.join(__dirname, "snapshots");

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
