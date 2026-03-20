import { describe, expect, it } from "vitest";
import {
  generateFromAst,
  generateTailwindCSS,
} from "../core/builders/tailwind";
import { buildValidatedAst } from "../core/transforms";
import type { Collections, Token } from "../core/types";

const MINIMAL_COLLECTIONS: Collections = {
  kind: "TokenCollections",
  metadata: { id: "test", name: "test" },
  data: [{ name: "global", modes: ["default"] }],
};

function makeToken(
  name: string,
  value: string | number,
  collection = "global"
): Token {
  return {
    kind: "Tokens",
    metadata: { id: "test", name: "test", description: "" },
    data: {
      collection,
      tokens: { [name]: { values: { default: value } } },
    },
  };
}

describe("tailwind generateFromAst", () => {
  it("generates 2-layer @theme (--color-*: var(--cocso-color-*))", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "cocso" });
    expect(result).toContain("@theme {");
    expect(result).toContain("--color-white: var(--cocso-color-white);");
    // Must NOT contain direct value
    expect(result).not.toContain("#ffffff");
  });

  it("excludes spacing tokens from @theme", () => {
    const tokens = [
      makeToken("$color.white", "#FFFFFF"),
      makeToken("$spacing.4", "6px"),
    ];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "cocso" });
    expect(result).toContain("--color-white:");
    expect(result).not.toContain("--spacing-4");
  });

  it("produces exactly 1 @utility (z-* only)", () => {
    const tokens = [makeToken("$z-index.base", "0")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "cocso" });
    const utilityCount = (result.match(/@utility/g) ?? []).length;
    expect(utilityCount).toBe(1);
    expect(result).toContain("@utility z-*");
  });

  it("uses dsPrefix option", () => {
    const tokens = [makeToken("$color.primary-500", "#256EF4")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "theme" });
    expect(result).toContain(
      "--color-primary-500: var(--theme-color-primary-500);"
    );
  });

  it("includes banner when provided", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      banner: "/* generated */",
    });
    expect(result).toContain("/* generated */");
    expect(result.indexOf("/* generated */")).toBeLessThan(
      result.indexOf("@theme")
    );
  });

  it("generateTailwindCSS wraps generateFromAst correctly", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const result = generateTailwindCSS(tokens, MINIMAL_COLLECTIONS, {
      prefix: "cocso",
    });
    expect(result).toContain("@theme {");
    expect(result).toContain("--color-white: var(--cocso-color-white);");
  });

  it("returns empty string for @theme when all tokens are in skipped collections", () => {
    const tokens = [makeToken("$spacing.4", "6px")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "cocso" });
    expect(result).not.toContain("@theme");
  });

  it("skips token names without $ prefix", () => {
    const tokens = [makeToken("color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "cocso" });
    expect(result).not.toContain("@theme");
  });

  it("does not duplicate theme variables for duplicated token declarations", () => {
    const ast = {
      collections: [{ name: "global", modes: ["default"] }],
      tokens: [
        {
          token: { name: "$color.white", collection: "global" },
          values: [{ mode: "default", value: "#FFFFFF" }],
        },
        {
          token: { name: "$color.white", collection: "global" },
          values: [{ mode: "default", value: "#FFFFFF" }],
        },
      ],
    };

    const result = generateFromAst(ast, { prefix: "cocso" });
    const colorWhiteCount = (result.match(/--color-white/g) ?? []).length;
    expect(colorWhiteCount).toBe(1);
  });
});
