import { describe, expect, it } from "vitest";
import { parseValue, valueToString } from "../core/parsers/value";

describe("parseValue", () => {
  it("parses hex color and normalizes to lowercase", () => {
    const result = parseValue("#FF0000");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "HexColor", value: "#ff0000" });
  });

  it("parses uppercase hex and lowercases it", () => {
    const result = parseValue("#FFFFFF");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "HexColor", value: "#ffffff" });
  });

  it("parses rgba color", () => {
    const result = parseValue("rgba(0, 0, 0, 0.5)");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({
      kind: "RgbaColor",
      r: 0,
      g: 0,
      b: 0,
      a: 0.5,
    });
  });

  it("parses rgba with trailing zero in alpha", () => {
    const result = parseValue("rgba(255, 255, 255, 0.10)");
    expect(result.isValid).toBe(true);
    if (result.value?.kind === "RgbaColor") {
      expect(result.value.a).toBe(0.1);
    }
  });

  it("parses simple token reference", () => {
    const result = parseValue("$color.neutral-950");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({
      kind: "TokenRef",
      collection: "color",
      token: "neutral-950",
    });
  });

  it("parses multi-level token reference", () => {
    const result = parseValue("$color.alpha.shadow1");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({
      kind: "TokenRef",
      collection: "color.alpha",
      token: "shadow1",
    });
  });

  it("parses size value", () => {
    const result = parseValue("8px");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "SizeValue", value: 8, unit: "px" });
  });

  it("parses duration value", () => {
    const result = parseValue("200ms");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({
      kind: "DurationValue",
      value: 200,
      unit: "ms",
    });
  });

  it("parses plain number string as StringValue", () => {
    const result = parseValue("100");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "StringValue", value: "100" });
  });

  it("parses shadow with token-ref color", () => {
    // Real shadow values use token references for colors, not inline rgba
    const result = parseValue(
      "0px 1px 2px 0px $color.alpha.shadow1, 0px 0px 2px 0px $color.alpha.shadow1"
    );
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("Shadow");
  });
});

describe("parseValue — additional types", () => {
  it("parses number input as NumberValue", () => {
    const result = parseValue(42);
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "NumberValue", value: 42 });
  });

  it("parses rgb color", () => {
    const result = parseValue("rgb(255, 128, 0)");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "RgbColor", r: 255, g: 128, b: 0 });
  });

  it("returns StringValue for plain string", () => {
    const result = parseValue("auto");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "StringValue", value: "auto" });
  });

  it("returns StringValue for unknown color string", () => {
    const result = parseValue("blue");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("StringValue");
  });

  it("parses size values with different units", () => {
    for (const unit of ["rem", "em", "vw", "vh", "%"] as const) {
      const result = parseValue(`1.5${unit}`);
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({ kind: "SizeValue", value: 1.5, unit });
    }
  });

  it("parses duration in seconds", () => {
    const result = parseValue("0.3s");
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: "DurationValue", value: 0.3, unit: "s" });
  });

  it("falls through to StringValue for rgb with out-of-range values", () => {
    // parseRgb rejects 256 > 255, but parseValue falls through to StringValue
    const result = parseValue("rgb(256, 0, 0)");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("StringValue");
  });

  it("falls through to StringValue for rgba with out-of-range RGB values", () => {
    const result = parseValue("rgba(0, 300, 0, 0.5)");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("StringValue");
  });

  it("falls through to StringValue for rgba with out-of-range alpha", () => {
    const result = parseValue("rgba(0, 0, 0, 2)");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("StringValue");
  });

  it("parses shadow with inline hex color", () => {
    const result = parseValue("2px 4px 6px 0px #000000");
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe("Shadow");
  });

  it("parses multi-layer shadow", () => {
    const result = parseValue(
      "0px 1px 2px 0px #000000, 0px 2px 4px 0px #000000"
    );
    expect(result.isValid).toBe(true);
    if (result.value?.kind === "Shadow") {
      expect(result.value.layers).toHaveLength(2);
    }
  });
});

describe("valueToString", () => {
  it("serializes hex color", () => {
    expect(valueToString({ kind: "HexColor", value: "#ff0000" })).toBe(
      "#ff0000"
    );
  });

  it("serializes rgb color", () => {
    expect(valueToString({ kind: "RgbColor", r: 255, g: 128, b: 0 })).toBe(
      "rgb(255, 128, 0)"
    );
  });

  it("serializes rgba color", () => {
    expect(
      valueToString({ kind: "RgbaColor", r: 0, g: 0, b: 0, a: 0.05 })
    ).toBe("rgba(0, 0, 0, 0.05)");
  });

  it("serializes TokenRef", () => {
    expect(
      valueToString({ kind: "TokenRef", collection: "color", token: "white" })
    ).toBe("$color.white");
  });

  it("serializes size value", () => {
    expect(valueToString({ kind: "SizeValue", value: 16, unit: "px" })).toBe(
      "16px"
    );
  });

  it("serializes DurationValue", () => {
    expect(
      valueToString({ kind: "DurationValue", value: 200, unit: "ms" })
    ).toBe("200ms");
  });

  it("serializes NumberValue", () => {
    expect(valueToString({ kind: "NumberValue", value: 5 })).toBe("5");
  });

  it("serializes StringValue", () => {
    expect(valueToString({ kind: "StringValue", value: "auto" })).toBe("auto");
  });

  it("serializes ShadowLayer", () => {
    const layer = {
      kind: "ShadowLayer" as const,
      offsetX: { kind: "SizeValue" as const, value: 0, unit: "px" as const },
      offsetY: { kind: "SizeValue" as const, value: 1, unit: "px" as const },
      blur: { kind: "SizeValue" as const, value: 2, unit: "px" as const },
      spread: { kind: "SizeValue" as const, value: 0, unit: "px" as const },
      color: { kind: "HexColor" as const, value: "#000000" as const },
    };
    expect(valueToString(layer)).toBe("0px 1px 2px 0px #000000");
  });

  it("serializes multi-layer Shadow", () => {
    const layer = {
      kind: "ShadowLayer" as const,
      offsetX: { kind: "SizeValue" as const, value: 0, unit: "px" as const },
      offsetY: { kind: "SizeValue" as const, value: 1, unit: "px" as const },
      blur: { kind: "SizeValue" as const, value: 2, unit: "px" as const },
      spread: { kind: "SizeValue" as const, value: 0, unit: "px" as const },
      color: { kind: "HexColor" as const, value: "#000000" as const },
    };
    const shadow = { kind: "Shadow" as const, layers: [layer, layer] };
    expect(valueToString(shadow)).toBe(
      "0px 1px 2px 0px #000000, 0px 1px 2px 0px #000000"
    );
  });
});
