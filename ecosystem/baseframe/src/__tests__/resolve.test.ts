import { describe, expect, it } from "vitest";
import { createTokenResolver } from "../core/transforms/resolve";
import type { TokenDecl } from "../core/types";

function makeDecl(name: string): TokenDecl {
  return {
    token: { name, collection: name.split(".")[0].slice(1) },
    values: [{ mode: "default", value: "#000000" }],
  };
}

const RE_LEADING_DOLLAR = /^\$/;
const RE_DOT = /\./g;

const cssVarNamer = (tokenName: string) =>
  `--test-${tokenName.replace(RE_LEADING_DOLLAR, "").replace(RE_DOT, "-")}`;

describe("createTokenResolver — resolveTokenRef", () => {
  it("returns var() for a known token ref", () => {
    const decl = makeDecl("$color.white");
    const resolver = createTokenResolver([decl], "default", cssVarNamer);
    const result = resolver.resolveTokenRef({
      kind: "TokenRef",
      collection: "color",
      token: "white",
    });
    expect(result).toBe("var(--test-color-white)");
  });

  it("throws when tokenRef is not in the map", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);
    expect(() =>
      resolver.resolveTokenRef({
        kind: "TokenRef",
        collection: "color",
        token: "missing",
      })
    ).toThrow("Token not found: $color.missing");
  });
});

describe("createTokenResolver — resolve (TokenRef case)", () => {
  it("resolves TokenRef value to StringValue wrapping var()", () => {
    const decl = makeDecl("$color.primary");
    const resolver = createTokenResolver([decl], "default", cssVarNamer);
    const result = resolver.resolve({
      kind: "TokenRef",
      collection: "color",
      token: "primary",
    });
    expect(result).toEqual({
      kind: "StringValue",
      value: "var(--test-color-primary)",
    });
  });

  it("throws when TokenRef value is not in the map", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);
    expect(() =>
      resolver.resolve({
        kind: "TokenRef",
        collection: "color",
        token: "ghost",
      })
    ).toThrow("Token not found: $color.ghost");
  });
});

describe("createTokenResolver — resolve (ShadowLayer case)", () => {
  it("resolves ShadowLayer with TokenRef color to StringValue", () => {
    const colorDecl = makeDecl("$color.alpha-shadow");
    const resolver = createTokenResolver([colorDecl], "default", cssVarNamer);

    const result = resolver.resolve({
      kind: "ShadowLayer",
      color: { kind: "TokenRef", collection: "color", token: "alpha-shadow" },
      offsetX: { kind: "SizeValue", value: 0, unit: "px" },
      offsetY: { kind: "SizeValue", value: 1, unit: "px" },
      blur: { kind: "SizeValue", value: 2, unit: "px" },
      spread: { kind: "SizeValue", value: 0, unit: "px" },
    });

    expect(result.kind).toBe("ShadowLayer");
    if (result.kind === "ShadowLayer") {
      expect(result.color).toEqual({
        kind: "StringValue",
        value: "var(--test-color-alpha-shadow)",
      });
      expect(result.offsetX).toEqual({
        kind: "SizeValue",
        value: 0,
        unit: "px",
      });
      expect(result.offsetY).toEqual({
        kind: "SizeValue",
        value: 1,
        unit: "px",
      });
      expect(result.blur).toEqual({ kind: "SizeValue", value: 2, unit: "px" });
      expect(result.spread).toEqual({
        kind: "SizeValue",
        value: 0,
        unit: "px",
      });
    }
  });

  it("resolves ShadowLayer with inline HexColor untouched", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);

    const result = resolver.resolve({
      kind: "ShadowLayer",
      color: { kind: "HexColor", value: "#ff0000" },
      offsetX: { kind: "SizeValue", value: 2, unit: "px" },
      offsetY: { kind: "SizeValue", value: 4, unit: "px" },
      blur: { kind: "SizeValue", value: 6, unit: "px" },
      spread: { kind: "SizeValue", value: 0, unit: "px" },
    });

    expect(result.kind).toBe("ShadowLayer");
    if (result.kind === "ShadowLayer") {
      expect(result.color).toEqual({ kind: "HexColor", value: "#ff0000" });
    }
  });
});

describe("createTokenResolver — resolve (Shadow case)", () => {
  it("resolves each layer inside a Shadow", () => {
    const colorDecl = makeDecl("$color.shadow");
    const resolver = createTokenResolver([colorDecl], "default", cssVarNamer);

    const layer = {
      kind: "ShadowLayer" as const,
      color: {
        kind: "TokenRef" as const,
        collection: "color",
        token: "shadow",
      },
      offsetX: { kind: "SizeValue" as const, value: 0, unit: "px" as const },
      offsetY: { kind: "SizeValue" as const, value: 1, unit: "px" as const },
      blur: { kind: "SizeValue" as const, value: 2, unit: "px" as const },
      spread: { kind: "SizeValue" as const, value: 0, unit: "px" as const },
    };

    const result = resolver.resolve({ kind: "Shadow", layers: [layer, layer] });

    expect(result.kind).toBe("Shadow");
    if (result.kind === "Shadow") {
      expect(result.layers).toHaveLength(2);
      for (const resolved of result.layers) {
        expect(resolved.color).toEqual({
          kind: "StringValue",
          value: "var(--test-color-shadow)",
        });
      }
    }
  });
});

describe("createTokenResolver — resolve (default case)", () => {
  it("returns StringValue unchanged", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);
    const input = { kind: "StringValue" as const, value: "auto" };
    expect(resolver.resolve(input)).toEqual(input);
  });

  it("returns HexColor unchanged", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);
    const input = { kind: "HexColor" as const, value: "#ffffff" as const };
    expect(resolver.resolve(input)).toEqual(input);
  });

  it("returns SizeValue unchanged", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);
    const input = {
      kind: "SizeValue" as const,
      value: 16,
      unit: "px" as const,
    };
    expect(resolver.resolve(input)).toEqual(input);
  });

  it("returns NumberValue unchanged", () => {
    const resolver = createTokenResolver([], "default", cssVarNamer);
    const input = { kind: "NumberValue" as const, value: 42 };
    expect(resolver.resolve(input)).toEqual(input);
  });
});
