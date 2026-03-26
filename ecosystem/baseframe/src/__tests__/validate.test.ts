import { describe, expect, it } from "vitest";
import { parseValue } from "../core/parsers";
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
  it("returns isValid=true for empty token input", () => {
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens([], definitions);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

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
    const tokens = [makeToken("$color.white", "#FFFFFF", "unknown-collection")];
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

  it("aggregates structural and reference errors from both validation passes", () => {
    const token: Token = {
      kind: "Tokens",
      metadata: { id: "test", name: "test", description: "" },
      data: {
        collection: "global",
        tokens: {
          "$color.text.primary": {
            values: { default: "$color.neutral.missing" },
          },
        },
      },
    };

    const definitions = makeDefinitions("global", ["default", "dark"]);
    const result = validateAllTokens([token], definitions);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "MISSING_MODE",
          tokenName: "$color.text.primary",
          collection: "global",
        }),
        expect.objectContaining({
          type: "INVALID_PRIMITIVE_TOKEN",
          tokenName: "$color.text.primary",
          collection: "global",
          mode: "default",
        }),
      ])
    );
  });

  it("returns INVALID_PRIMITIVE_TOKEN for dangling refs in a non-default mode", () => {
    const token: Token = {
      kind: "Tokens",
      metadata: { id: "test", name: "test", description: "" },
      data: {
        collection: "global",
        tokens: {
          "$color.text.primary": {
            values: {
              default: "#FFFFFF",
              dark: "$color.neutral.missing",
            },
          },
        },
      },
    };

    const definitions = makeDefinitions("global", ["default", "dark"]);
    const result = validateAllTokens([token], definitions);

    expect(result.isValid).toBe(false);
    expect(
      result.errors.find((e) => e.type === "MISSING_MODE")
    ).toBeUndefined();
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        type: "INVALID_PRIMITIVE_TOKEN",
        tokenName: "$color.text.primary",
        collection: "global",
        mode: "dark",
      })
    );
  });

  it("returns isValid=true for multi-mode tokens with resolved refs in every mode", () => {
    const tokens: Token[] = [
      {
        kind: "Tokens",
        metadata: { id: "test", name: "test", description: "" },
        data: {
          collection: "global",
          tokens: {
            "$color.neutral.base": {
              values: {
                default: "#FFFFFF",
                dark: "#000000",
              },
            },
          },
        },
      },
      {
        kind: "Tokens",
        metadata: { id: "test", name: "test", description: "" },
        data: {
          collection: "global",
          tokens: {
            "$color.text.primary": {
              values: {
                default: "$color.neutral.base",
                dark: "$color.neutral.base",
              },
            },
          },
        },
      },
    ];

    const definitions = makeDefinitions("global", ["default", "dark"]);
    const result = validateAllTokens(tokens, definitions);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it("returns INVALID_PRIMITIVE_TOKEN error for dangling token reference", () => {
    const tokens = [makeToken("$color.text", "$color.nonexistent")];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    const err = result.errors.find((e) => e.type === "INVALID_PRIMITIVE_TOKEN");
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

  it("returns INVALID_PRIMITIVE_TOKEN for dangling ref inside a ShadowLayer", () => {
    const token: Token = {
      kind: "Tokens",
      metadata: { id: "test", name: "test", description: "" },
      data: {
        collection: "global",
        tokens: {
          "$shadow.card": {
            values: { default: "0px 1px 2px 0px $color.alpha.shadow1" },
          },
        },
      },
    };
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens([token], definitions);
    expect(result.isValid).toBe(false);
    const err = result.errors.find((e) => e.type === "INVALID_PRIMITIVE_TOKEN");
    expect(err).toBeDefined();
    expect(err?.message).toContain("$color.alpha.shadow1");
  });

  it("returns isValid=true when shadow color ref resolves to a defined token", () => {
    const tokens: Token[] = [
      {
        kind: "Tokens",
        metadata: { id: "test", name: "test", description: "" },
        data: {
          collection: "global",
          tokens: {
            "$color.alpha.shadow1": { values: { default: "rgba(0,0,0,0.1)" } },
          },
        },
      },
      {
        kind: "Tokens",
        metadata: { id: "test", name: "test", description: "" },
        data: {
          collection: "global",
          tokens: {
            "$shadow.card": {
              values: { default: "0px 1px 2px 0px $color.alpha.shadow1" },
            },
          },
        },
      },
    ];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns INVALID_PRIMITIVE_TOKEN for dangling ref inside a multi-layer Shadow", () => {
    const token: Token = {
      kind: "Tokens",
      metadata: { id: "test", name: "test", description: "" },
      data: {
        collection: "global",
        tokens: {
          "$shadow.elevation": {
            values: {
              default:
                "0px 1px 2px 0px $color.alpha.shadow1, 0px 0px 2px 0px $color.alpha.shadow2",
            },
          },
        },
      },
    };
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens([token], definitions);
    expect(result.isValid).toBe(false);
    const ptErrors = result.errors.filter(
      (e) => e.type === "INVALID_PRIMITIVE_TOKEN"
    );
    expect(ptErrors.length).toBeGreaterThanOrEqual(2);
  });

  it("returns isValid=true for multi-layer Shadow when all color refs resolve", () => {
    const tokens: Token[] = [
      {
        kind: "Tokens",
        metadata: { id: "test", name: "test", description: "" },
        data: {
          collection: "global",
          tokens: {
            "$color.alpha.shadow1": { values: { default: "rgba(0,0,0,0.1)" } },
            "$color.alpha.shadow2": { values: { default: "rgba(0,0,0,0.05)" } },
          },
        },
      },
      {
        kind: "Tokens",
        metadata: { id: "test", name: "test", description: "" },
        data: {
          collection: "global",
          tokens: {
            "$shadow.elevation": {
              values: {
                default:
                  "0px 1px 2px 0px $color.alpha.shadow1, 0px 0px 2px 0px $color.alpha.shadow2",
              },
            },
          },
        },
      },
    ];
    const definitions = makeDefinitions("global", ["default"]);
    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("parseValue — INVALID_VALUE_FORMAT coverage", () => {
  it("parseValue never returns isValid=false for arbitrary strings", () => {
    const result = parseValue("not-a-valid-anything!!!");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("StringValue");
  });

  it("parseValue never returns isValid=false for empty string", () => {
    const result = parseValue("");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("StringValue");
  });

  it("parseValue never returns isValid=false for numeric token values", () => {
    const result = parseValue(42);
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("NumberValue");
  });
});
