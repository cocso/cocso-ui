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
      false: {
        root: {
          // 꺼진 트랙은 `surface-neutral` 이고 손잡이는 `text-on-primary` 라
          // 둘의 대비가 1.23:1 이다 — 손잡이가 어디 있는지가 이 컨트롤의 상태
          // 자체인데 그 경계가 보이지 않았다. WCAG 1.4.11 이 3:1 을 요구하는
          // 대상이 그것이다.
          //
          // 색 하나로는 풀리지 않는다: 두 트랙이 명도의 양 끝이라 둘 다에서
          // 3:1 을 넘는 중립색이 없다. 켜진 상태의 손잡이는 이미 18:1 이므로
          // 테두리는 꺼진 상태에만 필요하고, `text-secondary` 는 꺼진 트랙에서
          // 라이트 5.13 · 다크 3.92 로 두 테마 모두 넘는다.
          thumbBorderColor: "text-secondary",
        },
      },
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
