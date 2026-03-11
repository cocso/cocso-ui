import { describe, expect, it } from "vitest";
import { generateFromAst } from "../core/builders/tailwind";
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
    const result = generateFromAst(ast, { dsPrefix: "cocso" });
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
    const result = generateFromAst(ast, { dsPrefix: "cocso" });
    expect(result).toContain("--color-white:");
    expect(result).not.toContain("--spacing-4");
  });

  it("produces exactly 1 @utility (z-* only)", () => {
    const tokens = [makeToken("$z-index.base", "0")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { dsPrefix: "cocso" });
    const utilityCount = (result.match(/@utility/g) ?? []).length;
    expect(utilityCount).toBe(1);
    expect(result).toContain("@utility z-*");
  });

  it("uses dsPrefix option", () => {
    const tokens = [makeToken("$color.primary-500", "#256EF4")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { dsPrefix: "theme" });
    expect(result).toContain(
      "--color-primary-500: var(--theme-color-primary-500);"
    );
  });
});
