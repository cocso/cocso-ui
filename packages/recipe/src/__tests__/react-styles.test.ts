import { describe, expect, it } from "vitest";
import { badgeRecipe } from "../recipes/badge.recipe";
import { buttonRecipe } from "../recipes/button.recipe";
import { checkboxRecipe } from "../recipes/checkbox.recipe";
import { dialogRecipe } from "../recipes/dialog.recipe";
import { inputRecipe } from "../recipes/input.recipe";
import { linkRecipe } from "../recipes/link.recipe";
import { paginationRecipe } from "../recipes/pagination.recipe";
import { radioGroupRecipe } from "../recipes/radio-group.recipe";
import { selectRecipe } from "../recipes/select.recipe";
import { spinnerRecipe } from "../recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "../recipes/stock-quantity-status.recipe";
import { switchRecipe } from "../recipes/switch.recipe";
import { typographyRecipe } from "../recipes/typography.recipe";
import { resolveStyleMap } from "../resolvers/react-styles";

describe("camelToKebab (via resolveStyleMap output keys)", () => {
  it("converts bgColor to bg-color", () => {
    const result = resolveStyleMap(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect("--cocso-button-bg-color" in result).toBe(true);
  });

  it("converts paddingInline to padding-inline", () => {
    const result = resolveStyleMap(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect("--cocso-button-padding-inline" in result).toBe(true);
  });

  it("leaves single-word property unchanged (height)", () => {
    const result = resolveStyleMap(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect("--cocso-button-height" in result).toBe(true);
  });

  it("converts fontSize to font-size", () => {
    const result = resolveStyleMap(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect("--cocso-button-font-size" in result).toBe(true);
  });

  it("converts fontColor to font-color", () => {
    const result = resolveStyleMap(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect("--cocso-button-font-color" in result).toBe(true);
  });
});

describe("resolveStyleMap base resolution", () => {
  it("resolves button primary/medium/square base styles", () => {
    const result = resolveStyleMap(buttonRecipe, {
      variant: "primary",
      size: "medium",
      shape: "square",
    });
    expect(result["--cocso-button-bg-color"]).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(result["--cocso-button-font-color"]).toBe(
      "var(--cocso-color-white)"
    );
    expect(result["--cocso-button-height"]).toBe("36px");
    expect(result["--cocso-button-padding-inline"]).toBe("12px");
    expect(result["--cocso-button-font-size"]).toBe("14px");
    expect(result["--cocso-button-border-radius"]).toBe(
      "var(--cocso-radius-4)"
    );
  });

  it("resolves badge secondary/medium/square base styles", () => {
    const result = resolveStyleMap(badgeRecipe, {
      variant: "secondary",
      size: "medium",
      shape: "square",
    });
    expect(result["--cocso-badge-bg-color"]).toBe(
      "var(--cocso-color-neutral-50)"
    );
    expect(result["--cocso-badge-font-color"]).toBe(
      "var(--cocso-color-neutral-600)"
    );
    expect(result["--cocso-badge-border-radius"]).toBe("var(--cocso-radius-4)");
  });

  it("uses default variants when no variants passed", () => {
    const result = resolveStyleMap(buttonRecipe, {});
    expect(result["--cocso-button-bg-color"]).toBe(
      "var(--cocso-color-primary-950)"
    );
    expect(result["--cocso-button-height"]).toBe("36px");
  });
});

describe("resolveStyleMap multi-state resolution", () => {
  it("produces hover-suffixed keys for button", () => {
    const result = resolveStyleMap(
      buttonRecipe,
      { variant: "primary" },
      { states: ["hover"] }
    );
    expect("--cocso-button-bg-color-hover" in result).toBe(true);
    expect(result["--cocso-button-bg-color-hover"]).toBe(
      "var(--cocso-color-primary-800)"
    );
  });

  it("produces active-suffixed keys for button", () => {
    const result = resolveStyleMap(
      buttonRecipe,
      { variant: "primary" },
      { states: ["active"] }
    );
    expect("--cocso-button-bg-color-active" in result).toBe(true);
    expect(result["--cocso-button-bg-color-active"]).toBe(
      "var(--cocso-color-primary-700)"
    );
  });

  it("produces both hover and active keys when both requested", () => {
    const result = resolveStyleMap(
      buttonRecipe,
      { variant: "primary" },
      { states: ["hover", "active"] }
    );
    expect(result["--cocso-button-bg-color-hover"]).toBe(
      "var(--cocso-color-primary-800)"
    );
    expect(result["--cocso-button-bg-color-active"]).toBe(
      "var(--cocso-color-primary-700)"
    );
  });

  it("does not include state keys for properties not in state map", () => {
    const result = resolveStyleMap(
      buttonRecipe,
      { variant: "primary" },
      { states: ["hover"] }
    );
    // height is not overridden in hover state
    expect("--cocso-button-height-hover" in result).toBe(false);
  });
});

describe("resolveStyleMap hover === base edge case (link current variant)", () => {
  it("includes -hover key for current variant even though value equals base", () => {
    const result = resolveStyleMap(
      linkRecipe,
      { variant: "current" },
      { states: ["hover"] }
    );
    // current variant: base color === hover color === "currentColor"
    expect("--cocso-link-color-hover" in result).toBe(true);
    expect(result["--cocso-link-color"]).toBe("currentColor");
    expect(result["--cocso-link-color-hover"]).toBe("currentColor");
  });

  it("includes -hover key for inline variant", () => {
    const result = resolveStyleMap(
      linkRecipe,
      { variant: "inline" },
      { states: ["hover"] }
    );
    expect(result["--cocso-link-color"]).toBe("var(--cocso-color-info-500)");
    expect(result["--cocso-link-color-hover"]).toBe(
      "var(--cocso-color-info-700)"
    );
  });
});

describe("resolveStyleMap empty/no states", () => {
  it("empty states array returns base only (no state-suffixed keys)", () => {
    const result = resolveStyleMap(
      buttonRecipe,
      { variant: "primary" },
      { states: [] }
    );
    const stateKeys = Object.keys(result).filter(
      (k) => k.endsWith("-hover") || k.endsWith("-active")
    );
    expect(stateKeys).toHaveLength(0);
  });

  it("undefined options returns base only", () => {
    const result = resolveStyleMap(buttonRecipe, { variant: "primary" });
    const stateKeys = Object.keys(result).filter(
      (k) => k.endsWith("-hover") || k.endsWith("-active")
    );
    expect(stateKeys).toHaveLength(0);
  });

  it("recipe with no states and states requested returns base only", () => {
    const result = resolveStyleMap(
      badgeRecipe,
      { variant: "primary", size: "medium", shape: "square" },
      { states: ["hover"] }
    );
    const stateKeys = Object.keys(result).filter((k) => k.includes("-hover"));
    expect(stateKeys).toHaveLength(0);
  });
});

describe("resolveStyleMap snapshots for all recipe-aware recipes", () => {
  it("buttonRecipe default variants", () => {
    expect(resolveStyleMap(buttonRecipe, {})).toMatchSnapshot();
  });

  it("badgeRecipe default variants", () => {
    expect(resolveStyleMap(badgeRecipe, {})).toMatchSnapshot();
  });

  it("inputRecipe default variants", () => {
    expect(resolveStyleMap(inputRecipe, {})).toMatchSnapshot();
  });

  it("checkboxRecipe default variants", () => {
    expect(resolveStyleMap(checkboxRecipe, {})).toMatchSnapshot();
  });

  it("spinnerRecipe default variants", () => {
    expect(resolveStyleMap(spinnerRecipe, {})).toMatchSnapshot();
  });

  it("linkRecipe default variants", () => {
    expect(resolveStyleMap(linkRecipe, {})).toMatchSnapshot();
  });

  it("switchRecipe default variants", () => {
    expect(resolveStyleMap(switchRecipe, {})).toMatchSnapshot();
  });

  it("radioGroupRecipe default variants", () => {
    expect(resolveStyleMap(radioGroupRecipe, {})).toMatchSnapshot();
  });

  it("selectRecipe default variants", () => {
    expect(resolveStyleMap(selectRecipe, {})).toMatchSnapshot();
  });

  it("stockQuantityStatusRecipe default variants", () => {
    expect(resolveStyleMap(stockQuantityStatusRecipe, {})).toMatchSnapshot();
  });

  it("dialogRecipe default variants", () => {
    expect(resolveStyleMap(dialogRecipe, {})).toMatchSnapshot();
  });

  it("paginationRecipe default variants", () => {
    expect(resolveStyleMap(paginationRecipe, {})).toMatchSnapshot();
  });

  it("typographyRecipe default variants", () => {
    expect(resolveStyleMap(typographyRecipe, {})).toMatchSnapshot();
  });
});
