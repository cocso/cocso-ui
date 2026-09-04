import { defineRecipe } from "../define-recipe";

export const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root"] as const,
  base: {
    root: {
      switchBgColor: "surface-neutral",
      // 꺼진 트랙은 `surface-neutral` 이고 흰 배경에서 1.23:1 이라, 스위치가
      // 어디 있는지 보이지 않았다. WCAG 1.4.11 이 요구하는 3:1 은 컨트롤의
      // 경계에 대한 것이고, 켜진 트랙(`interactive-primary`)은 그 자체로 넘는다.
      borderColor: "border-strong",
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
