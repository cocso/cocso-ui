import { describe, expect, it } from "vitest";
import {
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  shadows,
  spacing,
  zIndex,
} from "./tokens";

describe("theme tokens", () => {
  it("resolves aliased colors from css variables", () => {
    expect(colors.primary500).toBe(colors.neutral500);
    expect(colors.textPrimary).toBe(colors.neutral950);
  });

  it("exposes spacing and radius as numeric values", () => {
    expect(spacing.s8).toBe(16);
    expect(spacing.max).toBe(1000);
    expect(radius.r4).toBe(8);
    expect(radius.full).toBe(1000);
  });

  it("exposes typography scales with predictable mappings", () => {
    expect(fontSize[12]).toBe(12);
    expect(fontSize[14]).toBe(14);
    expect(fontWeight.semibold).toBe(600);
    expect(lineHeight.relaxed).toBe(1.625);
  });

  it("exports native-friendly shadow objects", () => {
    expect(shadows.md).toEqual({
      elevation: 4,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    });
  });

  it("keeps z-index layering contract", () => {
    expect(zIndex.behind).toBeLessThan(zIndex.base);
    expect(zIndex.overlay).toBeGreaterThan(zIndex.header);
    expect(zIndex.dialogContent).toBeGreaterThan(zIndex.dialog);
  });
});
