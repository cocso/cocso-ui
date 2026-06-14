import { defineRecipe } from "../define-recipe";

export const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root"] as const,
  base: {
    root: {
      switchBgColor: "surface-neutral",
    },
  },
  variants: {
    variant: {
      primary: { root: { checkedBgColor: "interactive-primary" } },
      success: { root: { checkedBgColor: "interactive-success" } },
      error: { root: { checkedBgColor: "interactive-danger" } },
      warning: { root: { checkedBgColor: "interactive-warning-active" } },
      info: { root: { checkedBgColor: "interactive-info" } },
    },
    size: {
      large: {
        root: { width: 40, height: 22, thumbSize: 18, thumbOffset: 2 },
      },
      medium: {
        root: { width: 36, height: 20, thumbSize: 16, thumbOffset: 2 },
      },
      small: {
        root: { width: 32, height: 18, thumbSize: 14, thumbOffset: 2 },
      },
    },
    checked: {
      true: { root: {} },
      false: { root: {} },
    },
  },
  compoundVariants: [
    {
      conditions: { variant: "primary", checked: "true" },
      styles: { root: { switchBgColor: "interactive-primary" } },
    },
    {
      conditions: { variant: "success", checked: "true" },
      styles: { root: { switchBgColor: "interactive-success" } },
    },
    {
      conditions: { variant: "error", checked: "true" },
      styles: { root: { switchBgColor: "interactive-danger" } },
    },
    {
      conditions: { variant: "warning", checked: "true" },
      styles: { root: { switchBgColor: "interactive-warning-active" } },
    },
    {
      conditions: { variant: "info", checked: "true" },
      styles: { root: { switchBgColor: "interactive-info" } },
    },
  ],
  states: {
    hover: {
      variant: {
        primary: { root: { switchBgColor: "interactive-primary-hover" } },
        success: {
          root: { switchBgColor: "interactive-success-hover-subtle" },
        },
        error: { root: { switchBgColor: "interactive-danger-hover-subtle" } },
        warning: {
          root: { switchBgColor: "interactive-warning-hover-subtle" },
        },
        info: { root: { switchBgColor: "interactive-info-hover-subtle" } },
      },
      checked: {
        true: { root: {} },
        false: { root: { switchBgColor: "interactive-secondary-hover" } },
      },
    },
  },
  defaultVariants: { variant: "primary", size: "medium", checked: "true" },
});

export type SwitchVariant = keyof typeof switchRecipe.variants.variant;
export type SwitchSize = keyof typeof switchRecipe.variants.size;
