import { describe, expect, it, vi } from "vitest";
import { defineRecipe } from "../define-recipe";

describe("defineRecipe", () => {
  const testRecipe = defineRecipe({
    name: "test-button",
    slots: ["root"] as const,

    base: {
      root: { display: "inline-flex" },
    },

    variants: {
      variant: {
        primary: { root: { bgColor: "primary-950", textColor: "white" } },
        secondary: {
          root: { bgColor: "neutral-50", textColor: "neutral-600" },
        },
      },
      size: {
        large: {
          root: { height: 40, paddingInline: 14, borderRadius: "radius-4" },
        },
        medium: {
          root: { height: 36, paddingInline: 12, borderRadius: "radius-4" },
        },
      },
    },

    compoundVariants: [
      {
        conditions: { variant: "primary", size: "large" },
        styles: { root: { fontWeight: "bold" } },
      },
      {
        conditions: { size: ["large", "medium"] },
        styles: { root: { fontSize: 14 } },
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

  it("preserves recipe name", () => {
    expect(testRecipe.name).toBe("test-button");
  });

  it("preserves slots", () => {
    expect(testRecipe.slots).toEqual(["root"]);
  });

  it("preserves variant structure", () => {
    expect(testRecipe.variants.variant.primary.root.bgColor).toBe(
      "primary-950"
    );
    expect(testRecipe.variants.variant.secondary.root.textColor).toBe(
      "neutral-600"
    );
  });

  it("preserves size specs with numeric values", () => {
    expect(testRecipe.variants.size.large.root.height).toBe(40);
    expect(testRecipe.variants.size.medium.root.paddingInline).toBe(12);
  });

  it("preserves compound variants", () => {
    expect(testRecipe.compoundVariants).toHaveLength(2);
    expect(testRecipe.compoundVariants?.[0].conditions).toEqual({
      variant: "primary",
      size: "large",
    });
  });

  it("supports array conditions in compound variants", () => {
    expect(testRecipe.compoundVariants?.[1].conditions.size).toEqual([
      "large",
      "medium",
    ]);
  });

  it("preserves state overrides", () => {
    expect(testRecipe.states?.hover?.primary?.root?.bgColor).toBe(
      "primary-800"
    );
  });

  it("preserves default variants", () => {
    expect(testRecipe.defaultVariants).toEqual({
      variant: "primary",
      size: "medium",
    });
  });

  it("preserves base styles", () => {
    expect(testRecipe.base?.root?.display).toBe("inline-flex");
  });

  it("warns when variant dimension name contains a dash", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    defineRecipe({
      name: "dash-test",
      slots: ["root"] as const,
      variants: {
        "font-size": {
          sm: { root: { fontSize: 12 } },
        },
      },
    });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0]).toContain("font-size");
    expect(spy.mock.calls[0][0]).toContain("contains a dash");
    spy.mockRestore();
  });

  it("warns when variant value names collide across dimensions", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    defineRecipe({
      name: "collision-test",
      slots: ["root"] as const,
      variants: {
        variant: {
          shared: { root: { bgColor: "primary-950" } },
        },
        size: {
          shared: { root: { height: 40 } },
        },
      },
      defaultVariants: { variant: "shared", size: "shared" },
    });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0]).toContain("shared");
    spy.mockRestore();
  });
});
