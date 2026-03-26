import { describe, expect, it } from "vitest";
import { defineRecipe } from "../define-recipe";
import { resolveForReact, resolveStyleValue } from "../resolvers/react";

// ---------------------------------------------------------------------------
// resolveStyleValue unit tests
// ---------------------------------------------------------------------------

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
});

// ---------------------------------------------------------------------------
// resolveForReact integration tests
// ---------------------------------------------------------------------------

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
      primary: { root: { bgColor: "primary-800" } },
      secondary: { root: { bgColor: "neutral-100" } },
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
    // Non-overridden properties still present from base resolution
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
});
