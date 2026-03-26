/**
 * Extraction validation tests.
 *
 * Validates that the extracted component-specs.json contains correct
 * structural, dimensional, and color data for key components.
 */
import { describe, expect, it } from "vitest";
import componentSpecs from "../generated/component-specs.json";
import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";

interface NodeSpec {
  children?: NodeSpec[];
  cornerRadius?: number;
  effects?: unknown[];
  fills?: Array<{ color: { a: number; b: number; g: number; r: number } }>;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  height: number;
  strokes?: {
    color: { a: number; b: number; g: number; r: number };
    weight: number;
  };
  text?: string;
  type: "FRAME" | "TEXT";
  width: number;
}

interface VariantEntry {
  spec: NodeSpec;
  variantKey: string;
}
type Specs = Record<string, VariantEntry[]>;

const specs = componentSpecs as Specs;
const tokens = tokenData as FigmaTokenData;

function findVariant(component: string, key: string): NodeSpec | undefined {
  return specs[component]?.find((v) => v.variantKey === key)?.spec;
}

function findToken(name: string): FigmaColorValue | undefined {
  const token = tokens.tokens.find((t) => t.name === name);
  if (token && typeof token.values.default === "object") {
    return token.values.default as FigmaColorValue;
  }
  return undefined;
}

function colorClose(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  tolerance = 0.02
): boolean {
  return (
    Math.abs(a.r - b.r) < tolerance &&
    Math.abs(a.g - b.g) < tolerance &&
    Math.abs(a.b - b.b) < tolerance
  );
}

function findTextChild(node: NodeSpec): NodeSpec | undefined {
  if (node.type === "TEXT") {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findTextChild(child);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

describe("extraction validation", () => {
  it("component-specs.json exists and has components", () => {
    expect(Object.keys(specs).length).toBeGreaterThan(0);
  });

  describe("structural: Button", () => {
    const btn = findVariant("Button", "variant=primary,size=large");

    it("exists", () => {
      expect(btn).toBeDefined();
    });

    it("has fills (background color)", () => {
      expect(btn?.fills).toBeDefined();
      expect(btn?.fills?.length).toBeGreaterThan(0);
    });

    it("has cornerRadius", () => {
      expect(btn?.cornerRadius).toBeDefined();
      expect(btn?.cornerRadius).toBeGreaterThan(0);
    });

    it("has a text child", () => {
      const textChild = btn ? findTextChild(btn) : undefined;
      expect(textChild).toBeDefined();
      expect(textChild?.text).toBe("Button");
    });

    it("text uses Pretendard font", () => {
      const textChild = btn ? findTextChild(btn) : undefined;
      expect(textChild?.fontFamily).toContain("Pretendard");
    });
  });

  describe("structural: Badge", () => {
    const badge = findVariant("Badge", "variant=primary,size=medium");

    it("exists", () => {
      expect(badge).toBeDefined();
    });

    it("has fills", () => {
      expect(badge?.fills).toBeDefined();
      expect(badge?.fills?.length).toBeGreaterThan(0);
    });
  });

  describe("structural: Input", () => {
    const input = findVariant("Input", "state=default,size=medium");

    it("exists", () => {
      expect(input).toBeDefined();
    });

    it("has strokes from box-shadow border", () => {
      expect(input?.strokes).toBeDefined();
      expect(input?.strokes?.weight).toBe(1);
    });

    it("has shadow effects", () => {
      expect(input?.effects).toBeDefined();
      expect(input?.effects?.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("dimensional: Button heights", () => {
    const tolerance = 2;
    const expectedHeights: Record<string, number> = {
      "variant=primary,size=large": 40,
      "variant=primary,size=medium": 36,
      "variant=primary,size=small": 32,
      "variant=primary,size=x-small": 28,
    };

    for (const [key, expectedHeight] of Object.entries(expectedHeights)) {
      it(`${key} height ≈ ${expectedHeight}px`, () => {
        const btn = findVariant("Button", key);
        expect(btn).toBeDefined();
        expect(
          Math.abs((btn?.height ?? 0) - expectedHeight)
        ).toBeLessThanOrEqual(tolerance);
      });
    }
  });

  describe("color: primary Button fill matches token", () => {
    it("primary button bg matches color/primary-950", () => {
      const btn = findVariant("Button", "variant=primary,size=large");
      const tokenColor = findToken("color/primary-950");

      expect(btn?.fills).toBeDefined();
      expect(tokenColor).toBeDefined();

      if (btn?.fills?.[0]?.color && tokenColor) {
        expect(
          colorClose(btn.fills[0].color, {
            r: tokenColor.r,
            g: tokenColor.g,
            b: tokenColor.b,
          })
        ).toBe(true);
      }
    });

    it("success button bg matches color/success-500", () => {
      const btn = findVariant("Button", "variant=success,size=large");
      const tokenColor = findToken("color/success-500");

      expect(btn?.fills).toBeDefined();
      expect(tokenColor).toBeDefined();

      if (btn?.fills?.[0]?.color && tokenColor) {
        expect(
          colorClose(btn.fills[0].color, {
            r: tokenColor.r,
            g: tokenColor.g,
            b: tokenColor.b,
          })
        ).toBe(true);
      }
    });
  });

  describe("font family consistency", () => {
    it("all text nodes use Pretendard", () => {
      const fontFamilies = new Set<string>();
      function walk(node: NodeSpec) {
        if (node.fontFamily) {
          fontFamilies.add(node.fontFamily);
        }
        if (node.children) {
          for (const child of node.children) {
            walk(child);
          }
        }
      }
      for (const variants of Object.values(specs)) {
        for (const v of variants) {
          if (v.spec) {
            walk(v.spec);
          }
        }
      }
      for (const family of fontFamilies) {
        expect(family).toContain("Pretendard");
      }
    });
  });
});
