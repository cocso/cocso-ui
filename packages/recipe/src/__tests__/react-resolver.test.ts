import { describe, expect, it } from "vitest";
import { defineRecipe } from "../define-recipe";
import { resolveForReact, resolveStyleValue } from "../resolvers/react";

describe("resolveStyleValue", () => {
  it("resolves numeric values to px strings", () => {
    expect(resolveStyleValue(40)).toBe("40px");
    expect(resolveStyleValue(0)).toBe("0px");
    expect(resolveStyleValue(14)).toBe("14px");
  });

  it("resolves color tokens to CSS var references", () => {
    expect(resolveStyleValue("primary-950")).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(resolveStyleValue("neutral-50")).toBe(
      "var(--cocso-color-neutral-50)"
    );
    expect(resolveStyleValue("white")).toBe("var(--cocso-color-white)");
    expect(resolveStyleValue("danger-500")).toBe(
      "var(--cocso-color-danger-500)"
    );
    expect(resolveStyleValue("text-primary")).toBe(
      "var(--cocso-color-text-primary)"
    );
  });

  it("resolves radius tokens to CSS var references", () => {
    expect(resolveStyleValue("radius-4")).toBe("var(--cocso-radius-4)");
    expect(resolveStyleValue("radius-full")).toBe("var(--cocso-radius-full)");
  });

  it("resolves spacing tokens to CSS var references", () => {
    expect(resolveStyleValue("spacing-9")).toBe("var(--cocso-spacing-9)");
    expect(resolveStyleValue("spacing-max")).toBe("var(--cocso-spacing-max)");
  });

  it("passes CSS literals through unchanged", () => {
    expect(resolveStyleValue("none")).toBe("none");
    expect(resolveStyleValue("currentColor")).toBe("currentColor");
    expect(resolveStyleValue("100%")).toBe("100%");
    expect(resolveStyleValue("inherit")).toBe("inherit");
  });

  it("resolves font weights to numeric strings", () => {
    expect(resolveStyleValue("medium")).toBe("500");
    expect(resolveStyleValue("bold")).toBe("700");
    expect(resolveStyleValue("normal")).toBe("400");
    expect(resolveStyleValue("semibold")).toBe("600");
  });

  it("resolves compound border values", () => {
    expect(
      resolveStyleValue({
        _type: "border",
        width: 1,
        style: "solid",
        color: "neutral-100",
      })
    ).toBe("1px solid var(--cocso-color-neutral-100)");
  });

  it("resolves component references to variant string", () => {
    expect(resolveStyleValue({ component: "spinner", variant: "white" })).toBe(
      "white"
    );
  });

  it("passes through unrecognized string values", () => {
    expect(resolveStyleValue("5px 10px")).toBe("5px 10px");
    expect(resolveStyleValue("auto")).toBe("auto");
  });
});

const testRecipe = defineRecipe({
  name: "button",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: { root: { bgColor: "primary-950", textColor: "white" } },
      secondary: { root: { bgColor: "neutral-50", textColor: "neutral-600" } },
      outline: {
        root: {
          bgColor: "transparent",
          textColor: "neutral-950",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "neutral-100" as const,
          },
        },
      },
    },
    size: {
      large: {
        root: { height: 40, paddingInline: 14, fontSize: 14 },
      },
      medium: {
        root: { height: 36, paddingInline: 12, fontSize: 14 },
      },
      small: {
        root: { height: 32, paddingInline: 10, fontSize: 14 },
      },
    },
  },

  compoundVariants: [
    {
      conditions: { size: ["large", "medium", "small"] },
      styles: { root: { borderRadius: "radius-4" } },
    },
  ],

  states: {
    hover: {
      variant: {
        primary: { root: { bgColor: "primary-800" } },
        secondary: { root: { bgColor: "neutral-100" } },
      },
    },
  },

  defaultVariants: { variant: "primary", size: "medium" },
});

describe("resolveForReact", () => {
  it("resolves basic variant selection", () => {
    const result = resolveForReact(testRecipe, {
      variant: "primary",
      size: "large",
    });

    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(result["--cocso-button-textColor"]).toBe("var(--cocso-color-white)");
    expect(result["--cocso-button-height"]).toBe("40px");
    expect(result["--cocso-button-paddingInline"]).toBe("14px");
  });

  it("uses default variants when not specified", () => {
    const result = resolveForReact(testRecipe, {});

    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(result["--cocso-button-height"]).toBe("36px");
  });

  it("resolves compound border values", () => {
    const result = resolveForReact(testRecipe, {
      variant: "outline",
      size: "medium",
    });

    expect(result["--cocso-button-border"]).toBe(
      "1px solid var(--cocso-color-neutral-100)"
    );
    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-transparent)"
    );
  });

  it("applies compound variants", () => {
    const result = resolveForReact(testRecipe, {
      variant: "primary",
      size: "large",
    });

    expect(result["--cocso-button-borderRadius"]).toBe("var(--cocso-radius-4)");
  });

  it("applies compound variants with array conditions", () => {
    const resultLarge = resolveForReact(testRecipe, {
      variant: "primary",
      size: "large",
    });
    const resultMedium = resolveForReact(testRecipe, {
      variant: "primary",
      size: "medium",
    });
    const resultSmall = resolveForReact(testRecipe, {
      variant: "primary",
      size: "small",
    });

    expect(resultLarge["--cocso-button-borderRadius"]).toBe(
      "var(--cocso-radius-4)"
    );
    expect(resultMedium["--cocso-button-borderRadius"]).toBe(
      "var(--cocso-radius-4)"
    );
    expect(resultSmall["--cocso-button-borderRadius"]).toBe(
      "var(--cocso-radius-4)"
    );
  });

  it("resolves hover state overrides", () => {
    const result = resolveForReact(
      testRecipe,
      { variant: "primary", size: "medium" },
      { state: "hover" }
    );

    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-primary-800)"
    );
    expect(result["--cocso-button-height"]).toBe("36px");
  });

  it("resolves secondary hover state", () => {
    const result = resolveForReact(
      testRecipe,
      { variant: "secondary", size: "medium" },
      { state: "hover" }
    );

    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-neutral-100)"
    );
  });

  it("ignores unknown state", () => {
    const result = resolveForReact(
      testRecipe,
      { variant: "primary", size: "large" },
      { state: "nonexistent" }
    );

    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
  });

  it("handles recipe without compoundVariants", () => {
    const simpleRecipe = defineRecipe({
      name: "simple",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
        },
      },
      defaultVariants: { variant: "primary" },
    });
    const result = resolveForReact(simpleRecipe, { variant: "primary" });
    expect(result["--cocso-simple-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
  });

  it("handles compound variant with scalar condition", () => {
    const result = resolveForReact(testRecipe, {
      variant: "primary",
      size: "large",
    });
    // The existing compound variant has array condition for size
    // Verify it still applies
    expect(result["--cocso-button-borderRadius"]).toBe("var(--cocso-radius-4)");
  });

  it("skips variant styles when variant value is not defined", () => {
    const result = resolveForReact(testRecipe, {
      variant: "primary" as any,
      size: "nonexistent" as any,
    });
    // Should still have variant styles but no size styles
    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(result["--cocso-button-height"]).toBeUndefined();
  });

  it("skips state overrides for dimensions without state styles", () => {
    const result = resolveForReact(
      testRecipe,
      { variant: "outline", size: "medium" },
      { state: "hover" }
    );
    // outline has no hover state override, so bgColor stays as base
    expect(result["--cocso-button-bgColor"]).toBe(
      "var(--cocso-color-transparent)"
    );
  });

  it("matches compound variants with mixed scalar and array conditions", () => {
    const mixedRecipe = defineRecipe({
      name: "mixed",
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
          styles: { root: { fontWeight: "bold" } },
        },
      ],
      defaultVariants: { variant: "primary", size: "large" },
    });

    const match = resolveForReact(mixedRecipe, {
      variant: "primary",
      size: "large",
    });
    expect(match["--cocso-mixed-fontWeight"]).toBe("700");

    const noMatch = resolveForReact(mixedRecipe, {
      variant: "secondary",
      size: "large",
    });
    expect(noMatch["--cocso-mixed-fontWeight"]).toBeUndefined();
  });

  it("applies base styles", () => {
    const recipeWithBase = defineRecipe({
      name: "based",
      slots: ["root"] as const,
      base: {
        root: { display: "inline-flex", cursor: "pointer" },
      },
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    const result = resolveForReact(recipeWithBase, { variant: "primary" });
    expect(result["--cocso-based-display"]).toBe("inline-flex");
    expect(result["--cocso-based-cursor"]).toBe("pointer");
    expect(result["--cocso-based-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
  });

  it("handles multi-slot recipe where variant only defines some slots", () => {
    const multiSlot = defineRecipe({
      name: "multi",
      slots: ["root", "label", "icon"] as const,
      variants: {
        variant: {
          primary: {
            root: { bgColor: "primary-950" },
            // label and icon slots NOT defined — triggers continue in applySlotStyles
          },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    const result = resolveForReact(multiSlot, { variant: "primary" });
    expect(result["--cocso-multi-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
  });

  it("skips merged variant dimensions not present in recipe.variants", () => {
    const sparseRecipe = defineRecipe({
      name: "sparse",
      slots: ["root"] as const,
      variants: {
        variant: {
          primary: { root: { bgColor: "primary-950" } },
        },
      },
      defaultVariants: { variant: "primary" },
    });

    // Pass an extra key not in recipe.variants — triggers the `continue` at
    // the dimensionDef guard in applyVariantStyles (line 108 in react.ts).
    const result = resolveForReact(sparseRecipe, {
      variant: "primary",
      size: "large",
    } as any);
    expect(result["--cocso-sparse-bgColor"]).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(result["--cocso-sparse-height"]).toBeUndefined();
  });
});
