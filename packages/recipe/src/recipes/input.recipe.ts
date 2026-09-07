import { defineRecipe } from "../define-recipe";

export const inputRecipe = defineRecipe({
  name: "input",
  slots: ["root"] as const,
  variants: {
    size: {
      "x-small": {
        root: {
          height: 28,
          paddingX: 8,
          fontSize: 12,
          borderRadius: "radius-3",
        },
      },
      small: {
        root: {
          height: 32,
          paddingX: 10,
          fontSize: 12,
          borderRadius: "radius-3",
        },
      },
      medium: {
        root: {
          height: 36,
          paddingX: 12,
          fontSize: 14,
          borderRadius: "radius-4",
        },
      },
      large: {
        root: {
          height: 40,
          paddingX: 14,
          fontSize: 14,
          borderRadius: "radius-4",
        },
      },
    },
  },
  base: {
    root: {
      // 쉬는 상태의 테두리가 이 컨트롤이 어디 있는지 말하는 유일한 정보다 —
      // WCAG 1.4.11 이 3:1 을 요구하는 대상이 그것이고, `border-primary` 는
      // 흰 배경에서 1.54:1 이다. 웹의 `input.module.css` 는 이미 이 값을
      // 무시하고 `border-strong` 을 직접 그리고 있었으므로, 웹은 그대로이고
      // 레시피에서 값을 받는 iOS·Android 가 웹을 따라오게 된다.
      borderColor: "border-strong",
    },
  },
  states: {
    hover: {
      size: {
        "x-small": { root: { borderColor: "interactive-primary-muted" } },
        small: { root: { borderColor: "interactive-primary-muted" } },
        medium: { root: { borderColor: "interactive-primary-muted" } },
        large: { root: { borderColor: "interactive-primary-muted" } },
      },
    },
    focus: {
      size: {
        "x-small": { root: { borderColor: "interactive-primary-active" } },
        small: { root: { borderColor: "interactive-primary-active" } },
        medium: { root: { borderColor: "interactive-primary-active" } },
        large: { root: { borderColor: "interactive-primary-active" } },
      },
    },
  },
  defaultVariants: { size: "medium" },
});
