import { defineRecipe } from "../define-recipe";

export const checkboxRecipe = defineRecipe({
  name: "checkbox",
  slots: ["root"] as const,
  // Base emits the focus ring token the Checkbox CSS module reads, so consumers
  // can restyle focus through a custom property instead of a content-hashed
  // CSS Module class name.
  base: {
    root: { focusRingColor: "focus-ring" },
  },
  variants: {
    size: {
      large: { root: { size: 18, radius: "radius-3" } },
      medium: { root: { size: 16, radius: "radius-2" } },
      small: { root: { size: 14, radius: "radius-1" } },
    },
    status: {
      on: {
        root: {
          borderColor: "interactive-primary",
          bgColor: "interactive-primary",
        },
      },
      off: {
        root: {
          // 선택되지 않은 상태의 테두리가 이 컨트롤이 어디 있는지 말하는 유일한
          // 정보다. `border-secondary` 는 흰 배경에서 1.23:1 이라 WCAG 1.4.11 의
          // 3:1 을 넘지 못했다.
          borderColor: "border-strong",
          bgColor: "surface-primary",
        },
      },
      intermediate: {
        root: {
          borderColor: "interactive-primary",
          bgColor: "interactive-primary",
        },
      },
    },
  },
  states: {
    hover: {
      status: {
        on: {
          root: {
            bgColor: "interactive-primary-hover",
            borderColor: "interactive-primary-hover",
          },
        },
        off: {
          root: {
            bgColor: "interactive-secondary-hover",
            borderColor: "interactive-secondary-hover",
          },
        },
        intermediate: {
          root: {
            bgColor: "interactive-primary-hover",
            borderColor: "interactive-primary-hover",
          },
        },
      },
    },
  },
  defaultVariants: { size: "medium", status: "off" },
});
