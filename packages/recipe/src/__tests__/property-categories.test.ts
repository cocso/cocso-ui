import { describe, expect, it } from "vitest";
import { categoryOf } from "../utils/property-categories";

describe("categoryOf", () => {
  describe("explicit color properties", () => {
    it.each([
      "bgColor",
      "fontColor",
      "bladeColor",
      "borderColor",
      "fillColor",
      "checkedBgColor",
      "checkedThumbColor",
      "switchBgColor",
    ])('returns "color" for %s', (key) => {
      expect(categoryOf(key)).toBe("color");
    });
  });

  describe("explicit radius properties", () => {
    it.each([
      "borderRadius",
      "bladeRadius",
    ])('returns "radius" for %s', (key) => {
      expect(categoryOf(key)).toBe("radius");
    });
  });

  describe("heuristic: key contains 'color'", () => {
    it.each([
      "strokeColor",
      "overlayColor",
      "shadowColor",
    ])('returns "color" for %s (heuristic)', (key) => {
      expect(categoryOf(key)).toBe("color");
    });
  });

  describe("heuristic: key contains 'radius'", () => {
    it.each([
      "cornerRadius",
      "thumbRadius",
    ])('returns "radius" for %s (heuristic)', (key) => {
      expect(categoryOf(key)).toBe("radius");
    });
  });

  describe("non-categorized properties", () => {
    it.each([
      "height",
      "width",
      "fontSize",
      "fontWeight",
      "padding",
      "paddingInline",
      "contentPadding",
      "size",
      "blades",
      "bladeWidth",
      "bladeHeight",
    ])('returns "unknown" for %s', (key) => {
      expect(categoryOf(key)).toBe("unknown");
    });
  });

  it("is case-insensitive for heuristic matching", () => {
    expect(categoryOf("BGColor")).toBe("color");
    expect(categoryOf("BORDER_RADIUS")).toBe("radius");
  });
});
