import { describe, expect, it } from "vitest";
import { validateAllTokens } from "../core/transforms/validate";
import type { Collection, Token } from "../core/types";

function makeDefinitions(
  name: string,
  modes: string[]
): Map<string, Collection> {
  return new Map([[name, { name, modes }]]);
}

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

describe("validateAllTokens", () => {
  it("returns isValid=true for valid single-mode tokens", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns isValid=true for tokens referencing each other", () => {
    const tokens = [
      makeToken("$color.neutral-950", "#131416"),
      makeToken("$color.text.primary", "$color.neutral-950"),
    ];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
  });

  it("returns INVALID_COLLECTION error for unknown collection", () => {
    const tokens = [
      makeToken("$color.white", "#FFFFFF", "unknown-collection"),
    ];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    const err = result.errors.find((e) => e.type === "INVALID_COLLECTION");
    expect(err).toBeDefined();
    expect(err?.message).toContain("unknown-collection");
  });

  it("returns MISSING_MODE error when a token lacks a required mode", () => {
    const token: Token = {
      kind: "Tokens",
      metadata: { id: "test", name: "test", description: "" },
      data: {
        collection: "global",
        tokens: {
          "$color.white": { values: { default: "#FFFFFF" } },
        },
      },
    };
    const definitions = makeDefinitions("global", ["default", "dark"]);
    const result = validateAllTokens([token], definitions);
    expect(result.isValid).toBe(false);
    const err = result.errors.find((e) => e.type === "MISSING_MODE");
    expect(err).toBeDefined();
    expect(err?.message).toContain("dark");
  });

  it("returns INVALID_PRIMITIVE_TOKEN error for dangling token reference", () => {
    const tokens = [makeToken("$color.text", "$color.nonexistent")];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    const err = result.errors.find(
      (e) => e.type === "INVALID_PRIMITIVE_TOKEN"
    );
    expect(err).toBeDefined();
    expect(err?.message).toContain("$color.nonexistent");
  });

  it("accumulates multiple errors", () => {
    const tokens = [
      makeToken("$color.white", "#FFFFFF", "bad-col-1"),
      makeToken("$color.black", "#000000", "bad-col-2"),
    ];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    expect(
      result.errors.filter((e) => e.type === "INVALID_COLLECTION")
    ).toHaveLength(2);
  });
});
