import { describe, expect, it } from "vitest";
import { buildValidatedAst } from "../core/transforms";
import type { Collections, Token } from "../core/types";

const COLLECTIONS: Collections = {
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

describe("buildValidatedAst", () => {
  it("returns an Ast for valid tokens", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, COLLECTIONS);
    expect(ast).toBeDefined();
    expect(ast.tokens).toHaveLength(1);
    expect(ast.collections).toHaveLength(1);
  });

  it("returns Ast with multiple tokens", () => {
    const tokens = [
      makeToken("$color.white", "#FFFFFF"),
      makeToken("$color.black", "#000000"),
    ];
    const ast = buildValidatedAst(tokens, COLLECTIONS);
    expect(ast.tokens).toHaveLength(2);
  });

  it("throws when a token references an undefined collection", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF", "unknown-collection")];
    expect(() => buildValidatedAst(tokens, COLLECTIONS)).toThrow(
      "Token validation failed:"
    );
  });

  it("error message includes the invalid collection name", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF", "unknown-collection")];
    expect(() => buildValidatedAst(tokens, COLLECTIONS)).toThrow(
      "unknown-collection"
    );
  });

  it("error message lists all validation errors", () => {
    const tokens = [
      makeToken("$color.white", "#FFFFFF", "bad-col-1"),
      makeToken("$color.black", "#000000", "bad-col-2"),
    ];
    let message = "";
    try {
      buildValidatedAst(tokens, COLLECTIONS);
    } catch (e) {
      message = (e as Error).message;
    }
    expect(message).toContain("bad-col-1");
    expect(message).toContain("bad-col-2");
  });

  it("throws when a token references a nonexistent token", () => {
    const tokens = [makeToken("$color.text", "$color.nonexistent")];
    expect(() => buildValidatedAst(tokens, COLLECTIONS)).toThrow(
      "Token validation failed:"
    );
  });
});
