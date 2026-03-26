import { describe, expect, it } from "vitest";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import {
  resolveColorToken,
  resolveForFigma,
  resolveRadiusToken,
} from "../generators/recipe-resolver";

// ---------------------------------------------------------------------------
// Color token resolution
// ---------------------------------------------------------------------------

describe("resolveColorToken", () => {
  it("resolves color/primary-950 to correct RGB", () => {
    const rgb = resolveColorToken("primary-950");
    expect(rgb.r).toBeCloseTo(0.0745, 3);
    expect(rgb.g).toBeCloseTo(0.0784, 3);
    expect(rgb.b).toBeCloseTo(0.0863, 3);
  });

  it("resolves color/white to { r: 1, g: 1, b: 1 }", () => {
    const rgb = resolveColorToken("white");
    expect(rgb).toEqual({ r: 1, g: 1, b: 1 });
  });

  it("resolves full prefixed name color/primary-950", () => {
    const direct = resolveColorToken("color/primary-950");
    const shorthand = resolveColorToken("primary-950");
    expect(direct).toEqual(shorthand);
  });

  it("falls back to black for unknown token", () => {
    const rgb = resolveColorToken("does-not-exist-999");
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
  });
});

// ---------------------------------------------------------------------------
// Radius token resolution
// ---------------------------------------------------------------------------

describe("resolveRadiusToken", () => {
  it("resolves radius-1 to 2", () => {
    expect(resolveRadiusToken("radius-1")).toBe(2);
  });

  it("resolves radius-2 to 4", () => {
    expect(resolveRadiusToken("radius-2")).toBe(4);
  });

  it("resolves radius-3 to 6", () => {
    expect(resolveRadiusToken("radius-3")).toBe(6);
  });

  it("resolves radius-4 to 8", () => {
    expect(resolveRadiusToken("radius-4")).toBe(8);
  });

  it("resolves radius-5 to 12", () => {
    expect(resolveRadiusToken("radius-5")).toBe(12);
  });

  it("resolves radius-6 to 16", () => {
    expect(resolveRadiusToken("radius-6")).toBe(16);
  });

  it("resolves radius-full to 1000", () => {
    expect(resolveRadiusToken("radius-full")).toBe(1000);
  });

  it("returns 0 for unknown radius", () => {
    expect(resolveRadiusToken("radius-99")).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Button recipe — color fills
// ---------------------------------------------------------------------------

describe("resolveForFigma — button fills", () => {
  it("primary variant resolves bgColor to color/primary-950 RGB", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    const expected = resolveColorToken("primary-950");
    expect(spec.bgColor).toEqual(expected);
  });

  it("secondary variant resolves bgColor to color/neutral-50", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "secondary",
      size: "medium",
      shape: "square",
    });
    const expected = resolveColorToken("neutral-50");
    expect(spec.bgColor).toEqual(expected);
  });

  it("primary variant resolves fontColor to white", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect(spec.fontColor).toEqual({ r: 1, g: 1, b: 1 });
  });

  it("outline variant resolves CompoundBorder to strokeColor + strokeWeight", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "outline",
      size: "medium",
      shape: "square",
    });
    const expectedColor = resolveColorToken("neutral-100");
    expect(spec.strokeColor).toEqual(expectedColor);
    expect(spec.strokeWeight).toBe(1);
  });

  it("ghost variant has white bgColor", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "ghost",
      size: "medium",
      shape: "square",
    });
    expect(spec.bgColor).toEqual({ r: 1, g: 1, b: 1 });
  });
});

// ---------------------------------------------------------------------------
// Button recipe — size heights
// ---------------------------------------------------------------------------

describe("resolveForFigma — button sizes", () => {
  it("large size resolves height to 40", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "large",
      shape: "square",
    });
    expect(spec.height).toBe(40);
  });

  it("medium size resolves height to 36", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect(spec.height).toBe(36);
  });

  it("small size resolves height to 32", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "small",
      shape: "square",
    });
    expect(spec.height).toBe(32);
  });

  it("x-small size resolves height to 28", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "x-small",
      shape: "square",
    });
    expect(spec.height).toBe(28);
  });

  it("large size resolves fontSize to 14", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "large",
      shape: "square",
    });
    expect(spec.fontSize).toBe(14);
  });

  it("x-small size resolves fontSize to 12", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "x-small",
      shape: "square",
    });
    expect(spec.fontSize).toBe(12);
  });
});

// ---------------------------------------------------------------------------
// Button recipe — compound variants (border radius)
// ---------------------------------------------------------------------------

describe("resolveForFigma — button compound variants", () => {
  it("square shape + large size resolves borderRadius to 8 (radius-4)", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "large",
      shape: "square",
    });
    expect(spec.borderRadius).toBe(8);
  });

  it("square shape + medium size resolves borderRadius to 8 (radius-4)", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect(spec.borderRadius).toBe(8);
  });

  it("square shape + small size resolves borderRadius to 8 (radius-4)", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "small",
      shape: "square",
    });
    expect(spec.borderRadius).toBe(8);
  });

  it("square shape + x-small size resolves borderRadius to 6 (radius-3)", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "x-small",
      shape: "square",
    });
    expect(spec.borderRadius).toBe(6);
  });

  it("circle shape resolves borderRadius to 1000 (100%)", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "circle",
    });
    expect(spec.borderRadius).toBe(1000);
  });

  it("rounded shape resolves borderRadius to 1000 (radius-full)", () => {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "rounded",
    });
    expect(spec.borderRadius).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// Button recipe — defaultVariants fallback
// ---------------------------------------------------------------------------

describe("resolveForFigma — defaultVariants", () => {
  it("empty variants use defaultVariants (primary/medium/square)", () => {
    const spec = resolveForFigma(buttonRecipe, {});
    expect(spec.height).toBe(36);
    const primaryRgb = resolveColorToken("primary-950");
    expect(spec.bgColor).toEqual(primaryRgb);
    expect(spec.borderRadius).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// Spinner recipe — blade geometry
// ---------------------------------------------------------------------------

describe("resolveForFigma — spinner geometry", () => {
  it("primary/large resolves blades to 10, bladeWidth to 2, bladeHeight to 6, output to 20", () => {
    const spec = resolveForFigma(spinnerRecipe, {
      variant: "primary",
      size: "large",
    });
    expect(spec.blades).toBe(10);
    expect(spec.bladeWidth).toBe(2);
    expect(spec.bladeHeight).toBe(6);
    expect(spec.bladeRadius).toBe(1);
    expect(spec.output).toBe(20);
  });

  it("primary/medium resolves blades to 8, bladeHeight to 5, output to 16", () => {
    const spec = resolveForFigma(spinnerRecipe, {
      variant: "primary",
      size: "medium",
    });
    expect(spec.blades).toBe(8);
    expect(spec.bladeWidth).toBe(2);
    expect(spec.bladeHeight).toBe(5);
    expect(spec.bladeRadius).toBe(1);
    expect(spec.output).toBe(16);
  });

  it("primary/small resolves blades to 6, bladeWidth to 1.5, bladeHeight to 4, output to 12", () => {
    const spec = resolveForFigma(spinnerRecipe, {
      variant: "primary",
      size: "small",
    });
    expect(spec.blades).toBe(6);
    expect(spec.bladeWidth).toBe(1.5);
    expect(spec.bladeHeight).toBe(4);
    expect(spec.bladeRadius).toBe(0.75);
    expect(spec.output).toBe(12);
  });

  it("primary variant resolves bladeColor to color/primary-950 RGB", () => {
    const spec = resolveForFigma(spinnerRecipe, {
      variant: "primary",
      size: "medium",
    });
    const expected = resolveColorToken("primary-950");
    expect(spec.bladeColor).toEqual(expected);
  });

  it("white variant resolves bladeColor to { r: 1, g: 1, b: 1 }", () => {
    const spec = resolveForFigma(spinnerRecipe, {
      variant: "white",
      size: "medium",
    });
    expect(spec.bladeColor).toEqual({ r: 1, g: 1, b: 1 });
  });

  it("secondary variant resolves bladeColor to color/neutral-500", () => {
    const spec = resolveForFigma(spinnerRecipe, {
      variant: "secondary",
      size: "medium",
    });
    const expected = resolveColorToken("neutral-500");
    expect(spec.bladeColor).toEqual(expected);
  });
});
