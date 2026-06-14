import { describe, expect, it, vi } from "vitest";
import {
  resolveValueWithResolver,
  toCssValue,
} from "../core/builders/utils/css";
import type { TokenResolver } from "../core/transforms/resolve";

async function importCssUtilsWithParserMocks(parseResult: {
  isValid: boolean;
  value?: unknown;
}) {
  const parseValue = vi.fn().mockReturnValue(parseResult);
  const valueToString = vi.fn((value: unknown) => String(value));

  vi.resetModules();
  vi.doMock("../core/parsers", () => ({
    parseValue,
    valueToString,
  }));

  const cssUtils = await import("../core/builders/utils/css");

  return {
    ...cssUtils,
    parseValue,
    valueToString,
  };
}

describe("toCssValue", () => {
  it("returns string as-is", () => {
    expect(toCssValue("16px")).toBe("16px");
  });

  it("returns number as string", () => {
    expect(toCssValue(42)).toBe("42");
  });

  it("serializes HexColor Value", () => {
    expect(toCssValue({ kind: "HexColor", value: "#ff0000" })).toBe("#ff0000");
  });

  it("serializes RgbColor Value", () => {
    expect(toCssValue({ kind: "RgbColor", r: 255, g: 128, b: 0 })).toBe(
      "rgb(255, 128, 0)"
    );
  });

  it("serializes RgbaColor Value", () => {
    expect(toCssValue({ kind: "RgbaColor", r: 0, g: 0, b: 0, a: 0.5 })).toBe(
      "rgba(0, 0, 0, 0.5)"
    );
  });

  it("serializes SizeValue", () => {
    expect(toCssValue({ kind: "SizeValue", value: 16, unit: "px" })).toBe(
      "16px"
    );
  });

  it("serializes DurationValue", () => {
    expect(toCssValue({ kind: "DurationValue", value: 200, unit: "ms" })).toBe(
      "200ms"
    );
  });

  it("serializes NumberValue", () => {
    expect(toCssValue({ kind: "NumberValue", value: 5 })).toBe("5");
  });

  it("serializes StringValue", () => {
    expect(toCssValue({ kind: "StringValue", value: "auto" })).toBe("auto");
  });

  it("serializes TokenRef Value", () => {
    expect(
      toCssValue({ kind: "TokenRef", collection: "color", token: "white" })
    ).toBe("$color.white");
  });
});

describe("resolveValueWithResolver", () => {
  it("resolves a non-token value through the resolver", () => {
    const resolver: TokenResolver = {
      resolve: (_v) => ({ kind: "HexColor", value: "#ffffff" }),
      resolveTokenRef: vi.fn(),
    };
    const result = resolveValueWithResolver("16px", resolver);
    expect(result).toBe("#ffffff");
  });

  it("resolves a token reference via resolveTokenRef", () => {
    const resolver: TokenResolver = {
      resolve: vi.fn(),
      resolveTokenRef: (_ref) => "var(--cocso-color-white)",
    };
    const result = resolveValueWithResolver("$color.white", resolver);
    expect(result).toBe("var(--cocso-color-white)");
  });

  it("resolves a number value through the resolver", () => {
    const resolver: TokenResolver = {
      resolve: (v) => v,
      resolveTokenRef: vi.fn(),
    };
    const result = resolveValueWithResolver(16, resolver);
    expect(result).toBe("16");
  });

  it("resolves a hex color value", () => {
    const resolver: TokenResolver = {
      resolve: (v) => v,
      resolveTokenRef: vi.fn(),
    };
    const result = resolveValueWithResolver("#ff0000", resolver);
    expect(result).toBe("#ff0000");
  });

  it("returns the original non-token value when parsing fails", async () => {
    const { resolveValueWithResolver, parseValue, valueToString } =
      await importCssUtilsWithParserMocks({ isValid: false });
    const resolver: TokenResolver = {
      resolve: vi.fn(),
      resolveTokenRef: vi.fn(),
    };

    expect(resolveValueWithResolver("not-parseable", resolver)).toBe(
      "not-parseable"
    );
    expect(parseValue).toHaveBeenCalledWith("not-parseable");
    expect(resolver.resolve).not.toHaveBeenCalled();
    expect(valueToString).not.toHaveBeenCalled();

    vi.doUnmock("../core/parsers");
    vi.resetModules();
  });

  it("throws for an invalid token reference parse result", async () => {
    const { resolveValueWithResolver, parseValue } =
      await importCssUtilsWithParserMocks({ isValid: false });
    const resolver: TokenResolver = {
      resolve: vi.fn(),
      resolveTokenRef: vi.fn(),
    };

    expect(() => resolveValueWithResolver("$broken", resolver)).toThrowError(
      "Invalid token reference: $broken"
    );
    expect(parseValue).toHaveBeenCalledWith("$broken");
    expect(resolver.resolveTokenRef).not.toHaveBeenCalled();

    vi.doUnmock("../core/parsers");
    vi.resetModules();
  });
});
