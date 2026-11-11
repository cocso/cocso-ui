import { defineRecipe } from "../define-recipe";

export const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root"] as const,
  base: {
    root: {
      // 손잡이 색을 레시피가 정하지 않던 동안 웹·iOS·Android 가 각자 골랐다.
      // 웹은 `text-on-primary`, 두 모바일은 `surface-primary` 를 골랐고 —
      // 두 테마에서 같은 값으로 풀려서 보이는 것은 같았지만, 갈라질 자유가
      // 있었다는 것이 결함이다. 값은 웹이 그리던 것 그대로다.
      thumbColor: "text-on-primary",
      // The off track is a filled `interactive-control-off`, not a pale
      // `surface-neutral` outlined twice. The outline was a 1px ring around
      // the track (`border-control-muted`) plus a 1px ring around the thumb
      // (`border-on-control`); sitting side by side they read as one heavy
      // dark outline, louder than the label next to it. A fill that clears
      // 3:1 against the page, a card and the thumb needs neither ring.
      switchBgColor: "interactive-control-off",
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
        false: { root: { switchBgColor: "interactive-control-off-hover" } },
      },
    },
  },
  defaultVariants: { variant: "primary", size: "medium", checked: "true" },
});

export type SwitchVariant = keyof typeof switchRecipe.variants.variant;
export type SwitchSize = keyof typeof switchRecipe.variants.size;
