import { describe, expect, it } from "vitest";
import {
  generateTokenData,
  isShadowComposite,
  isTokenRef,
  parseHex,
  parseResolvedValue,
  parseRgba,
  parseSize,
  resolveTokenRef,
  toFigmaName,
} from "../../scripts/generate-tokens";
import type { FigmaColorValue } from "../types/token-schema";

describe("parseHex", () => {
  it("parses 6-digit hex to 0-1 RGBA", () => {
    const result = parseHex("#FFFFFF");
    expect(result).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it("parses black hex", () => {
    const result = parseHex("#000000");
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it("parses mixed hex", () => {
    const result = parseHex("#FF8000");
    expect(result.r).toBeCloseTo(1);
    expect(result.g).toBeCloseTo(0.502, 2);
    expect(result.b).toBeCloseTo(0);
    expect(result.a).toBe(1);
  });

  it("parses 3-digit shorthand hex", () => {
    const result = parseHex("#FFF");
    expect(result).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it("parses 4-digit shorthand hex with alpha", () => {
    // #F0FA expands to #FF00FFAA
    const result = parseHex("#F0FA");
    expect(result.r).toBe(1);
    expect(result.g).toBe(0);
    expect(result.b).toBe(1);
    expect(result.a).toBeCloseTo(170 / 255, 3);
  });

  it("parses 8-digit hex with alpha", () => {
    const result = parseHex("#00000080");
    expect(result.r).toBe(0);
    expect(result.a).toBeCloseTo(0.502, 2);
  });

  it("throws on invalid hex", () => {
    expect(() => parseHex("not-a-hex")).toThrow("Invalid HEX");
  });
});

describe("parseRgba", () => {
  it("parses rgba()", () => {
    const result = parseRgba("rgba(0, 0, 0, 0.5)");
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
  });

  it("parses rgba with full values", () => {
    const result = parseRgba("rgba(255, 255, 255, 0.9)");
    expect(result).toEqual({ r: 1, g: 1, b: 1, a: 0.9 });
  });

  it("parses rgb() without alpha", () => {
    const result = parseRgba("rgb(128, 64, 0)");
    expect(result.r).toBeCloseTo(0.502, 2);
    expect(result.g).toBeCloseTo(0.251, 2);
    expect(result.b).toBe(0);
    expect(result.a).toBe(1);
  });

  it("parses rgba with 0.04 alpha", () => {
    const result = parseRgba("rgba(0, 0, 0, 0.04)");
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0.04 });
  });

  it("throws on invalid rgba", () => {
    expect(() => parseRgba("not-rgba")).toThrow("Invalid rgba");
  });
});

describe("parseSize", () => {
  it("parses px values", () => {
    expect(parseSize("16px")).toBe(16);
    expect(parseSize("0px")).toBe(0);
    expect(parseSize("1000px")).toBe(1000);
  });

  it("parses negative px values", () => {
    expect(parseSize("-1px")).toBe(-1);
  });

  it("converts rem to px (* 16)", () => {
    expect(parseSize("1.5rem")).toBe(24);
    expect(parseSize("1rem")).toBe(16);
  });

  it("throws on invalid size", () => {
    expect(() => parseSize("not-a-size")).toThrow("Invalid size");
  });
});

describe("isTokenRef", () => {
  it("detects token references", () => {
    expect(isTokenRef("$color.neutral-50")).toBe(true);
    expect(isTokenRef("$spacing.8")).toBe(true);
  });

  it("rejects non-references", () => {
    expect(isTokenRef("#FFFFFF")).toBe(false);
    expect(isTokenRef("16px")).toBe(false);
    expect(isTokenRef("400")).toBe(false);
  });
});

describe("isShadowComposite", () => {
  it("detects composite shadow values", () => {
    expect(
      isShadowComposite(
        "0px 1px 2px 0px $color.alpha.shadow1, 0px 0px 2px 0px $color.alpha.shadow1"
      )
    ).toBe(true);
  });

  it("rejects simple values", () => {
    expect(isShadowComposite("8px")).toBe(false);
    expect(isShadowComposite("#FFFFFF")).toBe(false);
    expect(isShadowComposite("400")).toBe(false);
  });
});

describe("toFigmaName", () => {
  it("converts token names to Figma format", () => {
    expect(toFigmaName("$color.neutral-500")).toBe("color/neutral-500");
    expect(toFigmaName("$spacing.8")).toBe("spacing/8");
    expect(toFigmaName("$font-weight.bold")).toBe("font-weight/bold");
  });

  it("converts multi-level dot paths", () => {
    expect(toFigmaName("$color.alpha.shadow1")).toBe("color/alpha/shadow1");
    expect(toFigmaName("$color.text.primary")).toBe("color/text/primary");
  });
});

describe("resolveTokenRef", () => {
  it("resolves simple token references", () => {
    const tokenMap = new Map<string, string | number>([
      ["$color.neutral-50", "#F4F5F6"],
      ["$color.primary-50", "$color.neutral-50"],
    ]);
    expect(resolveTokenRef("$color.primary-50", tokenMap)).toBe("#F4F5F6");
  });

  it("resolves chained references", () => {
    const tokenMap = new Map<string, string | number>([
      ["$a", "$b"],
      ["$b", "$c"],
      ["$c", "#000000"],
    ]);
    expect(resolveTokenRef("$a", tokenMap)).toBe("#000000");
  });

  it("returns non-ref values directly", () => {
    const tokenMap = new Map<string, string | number>([
      ["$color.white", "#FFFFFF"],
    ]);
    expect(resolveTokenRef("$color.white", tokenMap)).toBe("#FFFFFF");
  });

  it("returns number values directly", () => {
    const tokenMap = new Map<string, string | number>([
      ["$font-weight.bold", 700],
    ]);
    expect(resolveTokenRef("$font-weight.bold", tokenMap)).toBe(700);
  });

  it("throws on circular reference", () => {
    const tokenMap = new Map<string, string | number>([
      ["$a", "$b"],
      ["$b", "$a"],
    ]);
    expect(() => resolveTokenRef("$a", tokenMap)).toThrow("Circular reference");
  });

  it("throws on unresolved reference", () => {
    const tokenMap = new Map<string, string | number>();
    expect(() => resolveTokenRef("$missing", tokenMap)).toThrow(
      "Unresolved token reference"
    );
  });
});

describe("parseResolvedValue", () => {
  it("parses hex to COLOR", () => {
    const result = parseResolvedValue("#FFFFFF");
    expect(result.type).toBe("COLOR");
    expect(result.value).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it("parses rgba to COLOR", () => {
    const result = parseResolvedValue("rgba(0, 0, 0, 0.5)");
    expect(result.type).toBe("COLOR");
    expect(result.value).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
  });

  it("parses px to FLOAT", () => {
    const result = parseResolvedValue("16px");
    expect(result.type).toBe("FLOAT");
    expect(result.value).toBe(16);
  });

  it("parses pure number to FLOAT", () => {
    const result = parseResolvedValue(700);
    expect(result.type).toBe("FLOAT");
    expect(result.value).toBe(700);
  });

  it("parses numeric string to FLOAT", () => {
    const result = parseResolvedValue("-1");
    expect(result.type).toBe("FLOAT");
    expect(result.value).toBe(-1);
  });

  it("parses zero string to FLOAT", () => {
    const result = parseResolvedValue("0");
    expect(result.type).toBe("FLOAT");
    expect(result.value).toBe(0);
  });

  it("throws on unparseable value", () => {
    expect(() => parseResolvedValue("unknown-format")).toThrow(
      "Unable to parse token value"
    );
  });
});

describe("parseResolvedValue — catch path via resolveTokenRef", () => {
  it("resolveTokenRef throws for an unresolved reference, matching the catch reason in generateTokenData", () => {
    const tokenMap = new Map<string, string | number>([
      ["$color.known", "#FFFFFF"],
    ]);
    // Simulates the error that would be caught in generateTokenData's catch block
    expect(() => resolveTokenRef("$color.missing", tokenMap)).toThrow(
      "Unresolved token reference"
    );
  });

  it("parseResolvedValue throws for shadow-like unparseable value, matching the catch reason in generateTokenData", () => {
    // A value that passes isShadowComposite=false but is still unparseable
    expect(() => parseResolvedValue("not-a-valid-format")).toThrow(
      "Unable to parse token value"
    );
  });
});

describe("generateTokenData (integration)", () => {
  it("generates valid FigmaTokenData from YAML sources", () => {
    const data = generateTokenData();

    expect(data.schemaVersion).toBe(1);
    expect(data.generatedAt).toBeTruthy();
    expect(data.collections).toHaveLength(1);
    expect(data.collections[0].name).toBe("cocso-ui");
    expect(data.collections[0].modes).toContain("default");

    // Should have tokens
    expect(data.tokens.length).toBeGreaterThan(100);

    // Check specific tokens
    const white = data.tokens.find((t) => t.name === "color/white");
    expect(white).toBeDefined();
    expect(white?.resolvedType).toBe("COLOR");
    expect(white?.values.default).toEqual({ r: 1, g: 1, b: 1, a: 1 });

    const spacing8 = data.tokens.find((t) => t.name === "spacing/8");
    expect(spacing8).toBeDefined();
    expect(spacing8?.resolvedType).toBe("FLOAT");
    expect(spacing8?.values.default).toBe(16);

    const radiusFull = data.tokens.find((t) => t.name === "radius/full");
    expect(radiusFull).toBeDefined();
    expect(radiusFull?.values.default).toBe(1000);

    const fontWeightBold = data.tokens.find(
      (t) => t.name === "font-weight/bold"
    );
    expect(fontWeightBold).toBeDefined();
    expect(fontWeightBold?.values.default).toBe(700);

    const zIndexBehind = data.tokens.find((t) => t.name === "z-index/behind");
    expect(zIndexBehind).toBeDefined();
    expect(zIndexBehind?.resolvedType).toBe("FLOAT");
    expect(zIndexBehind?.values.default).toBe(-1);

    const shadowY3 = data.tokens.find((t) => t.name === "shadow/y-3");
    expect(shadowY3).toBeDefined();
    expect(shadowY3?.values.default).toBe(8);

    // TokenRef resolution: $color.text.primary -> $color.neutral-950 -> #131416
    const textPrimary = data.tokens.find(
      (t) => t.name === "color/text/primary"
    );
    expect(textPrimary).toBeDefined();
    expect(textPrimary?.resolvedType).toBe("COLOR");

    // TokenRef resolution: $color.primary-50 -> $color.neutral-50 -> #F4F5F6
    const primary50 = data.tokens.find((t) => t.name === "color/primary-50");
    expect(primary50).toBeDefined();
    expect(primary50?.resolvedType).toBe("COLOR");
    const p50Val = primary50?.values.default as FigmaColorValue;
    // #F4F5F6 = rgb(244, 245, 246)
    expect(p50Val.r).toBeCloseTo(244 / 255, 2);
    expect(p50Val.g).toBeCloseTo(245 / 255, 2);
    expect(p50Val.b).toBeCloseTo(246 / 255, 2);

    // All COLOR tokens should have valid 0-1 range
    for (const token of data.tokens.filter((t) => t.resolvedType === "COLOR")) {
      const v = token.values.default as FigmaColorValue;
      expect(v.r).toBeGreaterThanOrEqual(0);
      expect(v.r).toBeLessThanOrEqual(1);
      expect(v.g).toBeGreaterThanOrEqual(0);
      expect(v.g).toBeLessThanOrEqual(1);
      expect(v.b).toBeGreaterThanOrEqual(0);
      expect(v.b).toBeLessThanOrEqual(1);
      expect(v.a).toBeGreaterThanOrEqual(0);
      expect(v.a).toBeLessThanOrEqual(1);
    }

    // All FLOAT tokens should be unitless numbers
    for (const token of data.tokens.filter((t) => t.resolvedType === "FLOAT")) {
      expect(typeof token.values.default).toBe("number");
    }
  });

  it("skips composite shadow tokens", () => {
    const data = generateTokenData();

    const skippedNames = data.skipped.map((s) => s.sourceTokenName);
    expect(skippedNames).toContain("$shadow.xs");
    expect(skippedNames).toContain("$shadow.sm");
    expect(skippedNames).toContain("$shadow.md");
    expect(skippedNames).toContain("$shadow.lg");

    for (const s of data.skipped) {
      expect(s.reason).toBeTruthy();
    }
  });
});
