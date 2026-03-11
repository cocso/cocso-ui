import { describe, expect, it } from "vitest";
import { generateFromAst } from "../core/builders/css-vars";
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

describe("css-vars generateFromAst", () => {
  it("generates :root block with prefixed vars", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result).toContain(":root {");
    expect(result).toContain("--cocso-color-white: #ffffff;");
  });

  it("resolves token reference to var()", () => {
    const tokens = [
      makeToken("$color.neutral-950", "#131416"),
      makeToken("$color.text.primary", "$color.neutral-950"),
    ];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result).toContain(
      "--cocso-color-text-primary: var(--cocso-color-neutral-950);"
    );
  });

  it("adds trailing newline to output", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result.endsWith("\n")).toBe(true);
  });
});
