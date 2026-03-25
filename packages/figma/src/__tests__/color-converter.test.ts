import { describe, expect, it } from "vitest";
import { clampColor, isValidColor } from "../core/color-converter";
import type { FigmaColorValue } from "../types/token-schema";

describe("isValidColor", () => {
  it("returns true for valid colors", () => {
    expect(isValidColor({ r: 0, g: 0, b: 0, a: 0 })).toBe(true);
    expect(isValidColor({ r: 1, g: 1, b: 1, a: 1 })).toBe(true);
    expect(isValidColor({ r: 0.5, g: 0.25, b: 0.75, a: 0.1 })).toBe(true);
  });

  it("returns false for out-of-range values", () => {
    expect(isValidColor({ r: -0.1, g: 0, b: 0, a: 1 })).toBe(false);
    expect(isValidColor({ r: 0, g: 1.1, b: 0, a: 1 })).toBe(false);
    expect(isValidColor({ r: 0, g: 0, b: 0, a: 2 })).toBe(false);
  });

  it("returns false for NaN values", () => {
    expect(isValidColor({ r: Number.NaN, g: 0, b: 0, a: 1 })).toBe(false);
  });
});

describe("clampColor", () => {
  it("clamps out-of-range values to 0-1", () => {
    const result = clampColor({ r: -0.5, g: 1.5, b: 0.5, a: 2 });
    expect(result).toEqual({ r: 0, g: 1, b: 0.5, a: 1 });
  });

  it("preserves valid values", () => {
    const color: FigmaColorValue = { r: 0.5, g: 0.25, b: 0.75, a: 0.1 };
    expect(clampColor(color)).toEqual(color);
  });
});
