import { defineRecipe } from "../define-recipe";

export const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root"] as const,
  base: {
    root: {
      switchBgColor: "neutral-100",
    },
  },
  variants: {
    variant: {
      primary: { root: { checkedBgColor: "primary-950" } },
      success: { root: { checkedBgColor: "success-500" } },
      error: { root: { checkedBgColor: "danger-500" } },
      warning: { root: { checkedBgColor: "warning-500" } },
      info: { root: { checkedBgColor: "info-500" } },
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
      styles: { root: { switchBgColor: "primary-950" } },
    },
    {
      conditions: { variant: "success", checked: "true" },
      styles: { root: { switchBgColor: "success-500" } },
    },
    {
      conditions: { variant: "error", checked: "true" },
      styles: { root: { switchBgColor: "danger-500" } },
    },
    {
      conditions: { variant: "warning", checked: "true" },
      styles: { root: { switchBgColor: "warning-500" } },
    },
    {
      conditions: { variant: "info", checked: "true" },
      styles: { root: { switchBgColor: "info-500" } },
    },
  ],
  states: {
    hover: {
      variant: {
        primary: { root: { switchBgColor: "primary-800" } },
        success: { root: { switchBgColor: "success-400" } },
        error: { root: { switchBgColor: "danger-400" } },
        warning: { root: { switchBgColor: "warning-400" } },
        info: { root: { switchBgColor: "info-400" } },
      },
      checked: {
        true: { root: {} },
        false: { root: { switchBgColor: "neutral-200" } },
      },
    },
  },
  defaultVariants: { variant: "primary", size: "medium", checked: "true" },
});

export type SwitchVariant = keyof typeof switchRecipe.variants.variant;
export type SwitchSize = keyof typeof switchRecipe.variants.size;
