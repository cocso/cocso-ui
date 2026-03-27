import { defineRecipe } from "@cocso-ui/recipe";
import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { paginationRecipe } from "@cocso-ui/recipe/recipes/pagination.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import { describe, expect, it } from "vitest";
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

  it("returns 0 for non-matching radius string", () => {
    expect(resolveRadiusToken("not-a-radius")).toBe(0);
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

// ---------------------------------------------------------------------------
// Edge cases — coverage for private helpers exercised through resolveForFigma
// ---------------------------------------------------------------------------

describe("resolveForFigma — edge cases", () => {
  it("resolves transparent and CSS literal values to no-op", () => {
    const recipe = defineRecipe({
      name: "test-transparent",
      slots: ["root"] as const,
      variants: {
        variant: {
          ghost: {
            root: { bgColor: "transparent", fontColor: "currentColor" },
          },
          none: { root: { bgColor: "none", fontColor: "inherit" } },
        },
      },
      defaultVariants: { variant: "ghost" },
    });

    const ghost = resolveForFigma(recipe, { variant: "ghost" });
    expect(ghost.bgColor).toBeUndefined();
    expect(ghost.fontColor).toBeUndefined();

    const none = resolveForFigma(recipe, { variant: "none" });
    expect(none.bgColor).toBeUndefined();
    expect(none.fontColor).toBeUndefined();
  });

  it("resolves 100% borderRadius to 1000", () => {
    const recipe = defineRecipe({
      name: "test-radius",
      slots: ["root"] as const,
      variants: {
        shape: {
          circle: { root: { borderRadius: "100%" } },
          rounded: { root: { borderRadius: "radius-full" } },
        },
      },
      defaultVariants: { shape: "circle" },
    });

    const circle = resolveForFigma(recipe, { shape: "circle" });
    expect(circle.borderRadius).toBe(1000);

    const rounded = resolveForFigma(recipe, { shape: "rounded" });
    expect(rounded.borderRadius).toBe(1000);
  });

  it("resolves color tokens on dynamic color keys", () => {
    const recipe = defineRecipe({
      name: "test-dynamic-color",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: {
            root: {
              checkedBgColor: "primary-950",
              switchBgColor: "neutral-200",
            },
          },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    const spec = resolveForFigma(recipe, { variant: "primary" });
    // checkedBgColor and switchBgColor contain "color" in lowercase, so isColorKey returns true
    expect(spec.checkedBgColor).toEqual(
      expect.objectContaining({ r: expect.any(Number) })
    );
    expect(spec.switchBgColor).toEqual(
      expect.objectContaining({ r: expect.any(Number) })
    );
  });

  it("parses CSS padding shorthand into individual values", () => {
    const recipe = defineRecipe({
      name: "test-padding",
      slots: ["root"] as const,
      variants: {
        size: {
          large: { root: { padding: "5px 10px" } },
          small: { root: { padding: "3px" } },
        },
      },
      defaultVariants: { size: "large" },
    });

    const large = resolveForFigma(recipe, { size: "large" });
    expect(large.paddingTop).toBe(5);
    expect(large.paddingBottom).toBe(5);
    expect(large.paddingLeft).toBe(10);
    expect(large.paddingRight).toBe(10);
    expect(large.padding).toBeUndefined();

    const small = resolveForFigma(recipe, { size: "small" });
    expect(small.paddingTop).toBe(3);
    expect(small.paddingBottom).toBe(3);
    expect(small.paddingLeft).toBe(3);
    expect(small.paddingRight).toBe(3);
  });

  it("normalizes paddingX to paddingLeft and paddingRight", () => {
    const recipe = defineRecipe({
      name: "test-paddingx",
      slots: ["root"] as const,
      variants: {
        size: {
          medium: { root: { paddingX: 12 } },
          custom: { root: { paddingLeft: 8, paddingX: 12 } },
        },
      },
      defaultVariants: { size: "medium" },
    });

    const medium = resolveForFigma(recipe, { size: "medium" });
    expect(medium.paddingLeft).toBe(12);
    expect(medium.paddingRight).toBe(12);
    expect(medium.paddingX).toBeUndefined();

    // paddingLeft already set should not be overridden by paddingX
    const custom = resolveForFigma(recipe, { size: "custom" });
    expect(custom.paddingLeft).toBe(8);
    expect(custom.paddingRight).toBe(12);
  });

  it("skips undefined variant values gracefully", () => {
    const recipe = defineRecipe({
      name: "test-undef",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
        },
        size: {
          large: { root: { height: 40 } },
        },
      },
      defaultVariants: { variant: "primary", size: "large" },
    });

    // Pass a variant value that doesn't exist in the dimension
    const spec = resolveForFigma(recipe, {
      variant: "primary",
      size: "nonexistent" as any,
    });
    expect(spec.bgColor).toBeDefined();
    expect(spec.height).toBeUndefined();
  });

  it("applies base styles from recipe", () => {
    const recipe = defineRecipe({
      name: "test-base",
      slots: ["root", "label"] as const,
      base: {
        root: { bgColor: "white", fontSize: 14 },
      },
      variants: {
        variant: {
          primary: { root: { fontColor: "primary-950" } },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    const spec = resolveForFigma(recipe, { variant: "primary" });
    expect(spec.fontSize).toBe(14);
    expect(spec.fontColor).toBeDefined();
  });

  it("skips unknown variant dimensions gracefully", () => {
    const recipe = defineRecipe({
      name: "test-skip",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    // Pass an extra unknown dimension — should not crash
    const spec = resolveForFigma(recipe, {
      variant: "primary",
      unknown: "value",
    } as any);
    expect(spec.bgColor).toEqual(
      expect.objectContaining({ r: expect.any(Number) })
    );
  });

  it("resolves compound border to strokeColor and strokeWeight", () => {
    const recipe = defineRecipe({
      name: "test-border",
      slots: ["root"] as const,
      variants: {
        variant: {
          outline: {
            root: {
              border: {
                _type: "border" as const,
                width: 2,
                style: "solid" as const,
                color: "danger-500" as const,
              },
            },
          },
        },
      },
      defaultVariants: { variant: "outline" },
    });

    const spec = resolveForFigma(recipe, { variant: "outline" });
    expect(spec.strokeWeight).toBe(2);
    expect(spec.strokeColor).toEqual(
      expect.objectContaining({ r: expect.any(Number) })
    );
  });

  it("handles recipe with no base styles", () => {
    const recipe = defineRecipe({
      name: "test-nobase",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    const spec = resolveForFigma(recipe, { variant: "primary" });
    expect(spec.bgColor).toEqual(
      expect.objectContaining({ r: expect.any(Number) })
    );
  });

  it("applies compound variants with array conditions", () => {
    const recipe = defineRecipe({
      name: "test-compound",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
          secondary: { root: { bgColor: "neutral-50" } },
        },
        size: {
          large: { root: { height: 40 } },
          small: { root: { height: 32 } },
        },
      },
      compoundVariants: [
        {
          conditions: { size: ["large", "small"] },
          styles: { root: { borderRadius: "radius-4" } },
        },
      ],
      defaultVariants: { variant: "primary", size: "large" },
    });

    const large = resolveForFigma(recipe, {
      variant: "primary",
      size: "large",
    });
    expect(large.borderRadius).toBe(8);

    const small = resolveForFigma(recipe, {
      variant: "secondary",
      size: "small",
    });
    expect(small.borderRadius).toBe(8);
  });

  it("handles non-matching compound variant conditions", () => {
    const recipe = defineRecipe({
      name: "test-nomatch",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
          secondary: { root: { bgColor: "neutral-50" } },
        },
        size: {
          large: { root: { height: 40 } },
          small: { root: { height: 32 } },
        },
      },
      compoundVariants: [
        {
          conditions: { variant: "primary", size: "large" },
          styles: { root: { fontWeight: 700 } },
        },
      ],
      defaultVariants: { variant: "primary", size: "large" },
    });

    const match = resolveForFigma(recipe, {
      variant: "primary",
      size: "large",
    });
    expect(match.fontWeight).toBe(700);

    const noMatch = resolveForFigma(recipe, {
      variant: "secondary",
      size: "small",
    });
    expect(noMatch.fontWeight).toBeUndefined();
  });

  it("passes through non-token string values", () => {
    const recipe = defineRecipe({
      name: "test-passthrough",
      slots: ["root"] as const,
      variants: {
        variant: {
          dashed: {
            root: {
              borderStyle:
                "dashed" as unknown as import("@cocso-ui/recipe").StyleValue,
            },
          },
        },
      },
      defaultVariants: { variant: "dashed" },
    });

    const spec = resolveForFigma(recipe, { variant: "dashed" });
    expect(spec.borderStyle).toBe("dashed");
  });
});

// ---------------------------------------------------------------------------
// Dialog recipe — border, shadow, sizes
// ---------------------------------------------------------------------------

describe("resolveForFigma — dialog recipe", () => {
  it("base resolves border to strokeColor (neutral-100) and strokeWeight (1)", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "medium" });
    const expected = resolveColorToken("neutral-100");
    expect(spec.strokeColor).toEqual(expected);
    expect(spec.strokeWeight).toBe(1);
  });

  it("base resolves borderRadius to 12 (radius-5)", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "medium" });
    expect(spec.borderRadius).toBe(12);
  });

  it("base resolves bgColor to white", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "medium" });
    expect(spec.bgColor).toEqual({ r: 1, g: 1, b: 1 });
  });

  it("base resolves padding to 20 on all sides (spacing-9)", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "medium" });
    expect(spec.paddingTop).toBe(20);
    expect(spec.paddingBottom).toBe(20);
    expect(spec.paddingLeft).toBe(20);
    expect(spec.paddingRight).toBe(20);
  });

  it("small size resolves width=380, height=200", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "small" });
    expect(spec.width).toBe(380);
    expect(spec.height).toBe(200);
  });

  it("medium size resolves width=520, height=260", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "medium" });
    expect(spec.width).toBe(520);
    expect(spec.height).toBe(260);
  });

  it("large size resolves width=680, height=340", () => {
    const spec = resolveForFigma(dialogRecipe, { size: "large" });
    expect(spec.width).toBe(680);
    expect(spec.height).toBe(340);
  });
});

// ---------------------------------------------------------------------------
// Badge recipe — variants, border, padding
// ---------------------------------------------------------------------------

describe("resolveForFigma — badge recipe", () => {
  it("secondary variant resolves bgColor to neutral-50", () => {
    const spec = resolveForFigma(badgeRecipe, {
      variant: "secondary",
      size: "medium",
      shape: "square",
    });
    expect(spec.bgColor).toEqual(resolveColorToken("neutral-50"));
    expect(spec.fontColor).toEqual(resolveColorToken("neutral-600"));
  });

  it("outline variant resolves border to strokeColor + strokeWeight", () => {
    const spec = resolveForFigma(badgeRecipe, {
      variant: "outline",
      size: "medium",
      shape: "square",
    });
    expect(spec.strokeColor).toEqual(resolveColorToken("neutral-100"));
    expect(spec.strokeWeight).toBe(1);
  });

  it("large size parses padding shorthand '5px 10px'", () => {
    const spec = resolveForFigma(badgeRecipe, {
      variant: "secondary",
      size: "large",
      shape: "square",
    });
    expect(spec.paddingTop).toBe(5);
    expect(spec.paddingBottom).toBe(5);
    expect(spec.paddingLeft).toBe(10);
    expect(spec.paddingRight).toBe(10);
    expect(spec.fontSize).toBe(14);
  });

  it("square/medium resolves borderRadius to 8 (radius-4)", () => {
    const spec = resolveForFigma(badgeRecipe, {
      variant: "secondary",
      size: "medium",
      shape: "square",
    });
    expect(spec.borderRadius).toBe(8);
  });

  it("square/small resolves borderRadius to 6 (radius-3)", () => {
    const spec = resolveForFigma(badgeRecipe, {
      variant: "secondary",
      size: "small",
      shape: "square",
    });
    expect(spec.borderRadius).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Input recipe — sizes
// ---------------------------------------------------------------------------

describe("resolveForFigma — input recipe", () => {
  it("medium size resolves height=36, paddingLeft=12, paddingRight=12, fontSize=14, borderRadius=8", () => {
    const spec = resolveForFigma(inputRecipe, { size: "medium" });
    expect(spec.height).toBe(36);
    expect(spec.paddingLeft).toBe(12);
    expect(spec.paddingRight).toBe(12);
    expect(spec.fontSize).toBe(14);
    expect(spec.borderRadius).toBe(8);
  });

  it("x-small size resolves height=28, paddingLeft=8, paddingRight=8, fontSize=12, borderRadius=6", () => {
    const spec = resolveForFigma(inputRecipe, { size: "x-small" });
    expect(spec.height).toBe(28);
    expect(spec.paddingLeft).toBe(8);
    expect(spec.paddingRight).toBe(8);
    expect(spec.fontSize).toBe(12);
    expect(spec.borderRadius).toBe(6);
  });

  it("large size resolves height=40, borderRadius=8", () => {
    const spec = resolveForFigma(inputRecipe, { size: "large" });
    expect(spec.height).toBe(40);
    expect(spec.borderRadius).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// Select recipe — sizes and iconRight
// ---------------------------------------------------------------------------

describe("resolveForFigma — select recipe", () => {
  it("medium size resolves height=36, paddingLeft=12, iconRight=12, fontSize=14, borderRadius=8", () => {
    const spec = resolveForFigma(selectRecipe, { size: "medium" });
    expect(spec.height).toBe(36);
    expect(spec.paddingLeft).toBe(12);
    expect(spec.iconRight).toBe(12);
    expect(spec.fontSize).toBe(14);
    expect(spec.borderRadius).toBe(8);
  });

  it("x-small size resolves height=28, paddingLeft=8, iconRight=8, borderRadius=6", () => {
    const spec = resolveForFigma(selectRecipe, { size: "x-small" });
    expect(spec.height).toBe(28);
    expect(spec.paddingLeft).toBe(8);
    expect(spec.iconRight).toBe(8);
    expect(spec.borderRadius).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Link recipe — color variants
// ---------------------------------------------------------------------------

describe("resolveForFigma — link recipe", () => {
  it("inline variant resolves color to info-500", () => {
    const spec = resolveForFigma(linkRecipe, { variant: "inline" });
    expect(spec.color).toEqual(resolveColorToken("info-500"));
  });

  it("current variant resolves color to undefined (currentColor filtered)", () => {
    const spec = resolveForFigma(linkRecipe, { variant: "current" });
    expect(spec.color).toBeUndefined();
  });

  it("plain variant resolves color to info-500", () => {
    const spec = resolveForFigma(linkRecipe, { variant: "plain" });
    expect(spec.color).toEqual(resolveColorToken("info-500"));
  });
});

// ---------------------------------------------------------------------------
// Checkbox recipe — size, status
// ---------------------------------------------------------------------------

describe("resolveForFigma — checkbox recipe", () => {
  it("medium/on resolves size=16, radius=4 (radius-2), bgColor=primary-950, borderColor=primary-950", () => {
    const spec = resolveForFigma(checkboxRecipe, {
      size: "medium",
      status: "on",
    });
    expect(spec.size).toBe(16);
    expect(spec.radius).toBe(4);
    expect(spec.bgColor).toEqual(resolveColorToken("primary-950"));
    expect(spec.borderColor).toEqual(resolveColorToken("primary-950"));
  });

  it("medium/off resolves bgColor=white, borderColor=neutral-100", () => {
    const spec = resolveForFigma(checkboxRecipe, {
      size: "medium",
      status: "off",
    });
    expect(spec.bgColor).toEqual({ r: 1, g: 1, b: 1 });
    expect(spec.borderColor).toEqual(resolveColorToken("neutral-100"));
  });

  it("large/on resolves size=18, radius=6 (radius-3)", () => {
    const spec = resolveForFigma(checkboxRecipe, {
      size: "large",
      status: "on",
    });
    expect(spec.size).toBe(18);
    expect(spec.radius).toBe(6);
  });

  it("small/intermediate resolves size=14, radius=2 (radius-1), bgColor=primary-950", () => {
    const spec = resolveForFigma(checkboxRecipe, {
      size: "small",
      status: "intermediate",
    });
    expect(spec.size).toBe(14);
    expect(spec.radius).toBe(2);
    expect(spec.bgColor).toEqual(resolveColorToken("primary-950"));
  });
});

// ---------------------------------------------------------------------------
// Switch recipe — variant, size
// ---------------------------------------------------------------------------

describe("resolveForFigma — switch recipe", () => {
  it("primary/medium resolves checkedBgColor=primary-950, width=36, height=20, thumbSize=16, thumbOffset=2", () => {
    const spec = resolveForFigma(switchRecipe, {
      variant: "primary",
      size: "medium",
    });
    expect(spec.checkedBgColor).toEqual(resolveColorToken("primary-950"));
    expect(spec.width).toBe(36);
    expect(spec.height).toBe(20);
    expect(spec.thumbSize).toBe(16);
    expect(spec.thumbOffset).toBe(2);
  });

  it("success/large resolves checkedBgColor=success-500, width=40, height=22", () => {
    const spec = resolveForFigma(switchRecipe, {
      variant: "success",
      size: "large",
    });
    expect(spec.checkedBgColor).toEqual(resolveColorToken("success-500"));
    expect(spec.width).toBe(40);
    expect(spec.height).toBe(22);
  });
});

// ---------------------------------------------------------------------------
// RadioGroup recipe — sizes
// ---------------------------------------------------------------------------

describe("resolveForFigma — radio recipe", () => {
  it("medium resolves size=16, dotSize=7", () => {
    const spec = resolveForFigma(radioGroupRecipe, { size: "medium" });
    expect(spec.size).toBe(16);
    expect(spec.dotSize).toBe(7);
  });

  it("large resolves size=18, dotSize=8", () => {
    const spec = resolveForFigma(radioGroupRecipe, { size: "large" });
    expect(spec.size).toBe(18);
    expect(spec.dotSize).toBe(8);
  });

  it("small resolves size=14, dotSize=6", () => {
    const spec = resolveForFigma(radioGroupRecipe, { size: "small" });
    expect(spec.size).toBe(14);
    expect(spec.dotSize).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Typography recipe — compound variants
// ---------------------------------------------------------------------------

describe("resolveForFigma — typography recipe", () => {
  it("body/medium resolves fontSize=16 (compound override)", () => {
    const spec = resolveForFigma(typographyRecipe, {
      type: "body",
      size: "medium",
    });
    expect(spec.fontSize).toBe(16);
  });

  it("body/x-small resolves fontSize=12 (compound override)", () => {
    const spec = resolveForFigma(typographyRecipe, {
      type: "body",
      size: "x-small",
    });
    expect(spec.fontSize).toBe(12);
  });

  it("heading/large resolves fontSize=24, fontWeight=700", () => {
    const spec = resolveForFigma(typographyRecipe, {
      type: "heading",
      size: "large",
    });
    expect(spec.fontSize).toBe(24);
    expect(spec.fontWeight).toBe(700);
  });

  it("heading/x-large resolves fontSize=28", () => {
    const spec = resolveForFigma(typographyRecipe, {
      type: "heading",
      size: "x-large",
    });
    expect(spec.fontSize).toBe(28);
  });
});

// ---------------------------------------------------------------------------
// Pagination recipe — states and base
// ---------------------------------------------------------------------------

describe("resolveForFigma — pagination recipe", () => {
  it("active state resolves bgColor=primary-950, fontColor=white, fontWeight=600", () => {
    const spec = resolveForFigma(paginationRecipe, { state: "active" });
    expect(spec.bgColor).toEqual(resolveColorToken("primary-950"));
    expect(spec.fontColor).toEqual({ r: 1, g: 1, b: 1 });
    expect(spec.fontWeight).toBe(600);
  });

  it("inactive state resolves fontColor=neutral-900, no bgColor", () => {
    const spec = resolveForFigma(paginationRecipe, { state: "inactive" });
    expect(spec.fontColor).toEqual(resolveColorToken("neutral-900"));
    expect(spec.bgColor).toBeUndefined();
  });

  it("base resolves height=32, width=32, borderRadius=8 (radius-4), fontSize=14", () => {
    const spec = resolveForFigma(paginationRecipe, { state: "active" });
    expect(spec.height).toBe(32);
    expect(spec.width).toBe(32);
    expect(spec.borderRadius).toBe(8);
    expect(spec.fontSize).toBe(14);
  });
});

// ---------------------------------------------------------------------------
// StockQuantityStatus recipe — color variants
// ---------------------------------------------------------------------------

describe("resolveForFigma — stock-quantity-status recipe", () => {
  it("여유 resolves color to info-500", () => {
    const spec = resolveForFigma(stockQuantityStatusRecipe, {
      quantity: "여유",
    });
    expect(spec.color).toEqual(resolveColorToken("info-500"));
  });

  it("보통 resolves color to success-400", () => {
    const spec = resolveForFigma(stockQuantityStatusRecipe, {
      quantity: "보통",
    });
    expect(spec.color).toEqual(resolveColorToken("success-400"));
  });

  it("부족 resolves color to danger-500", () => {
    const spec = resolveForFigma(stockQuantityStatusRecipe, {
      quantity: "부족",
    });
    expect(spec.color).toEqual(resolveColorToken("danger-500"));
  });
});
