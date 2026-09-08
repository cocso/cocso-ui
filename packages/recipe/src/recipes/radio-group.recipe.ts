import { defineRecipe } from "../define-recipe";

export const radioGroupRecipe = defineRecipe({
  name: "radio",
  slots: ["root"] as const,
  // Base emits the tokens the RadioGroup CSS module reads, so consumers can
  // restyle selection and focus through custom properties instead of
  // content-hashed CSS Module class names.
  base: {
    root: {
      bgColor: "surface-primary",
      borderColor: "text-primary",
      checkedColor: "interactive-primary",
      focusRingColor: "focus-ring",
    },
  },
  variants: {
    size: {
      large: { root: { size: 18, dotSize: 8 } },
      medium: { root: { size: 16, dotSize: 7 } },
      small: { root: { size: 14, dotSize: 6 } },
    },
    // The web's `[data-checked]`: the fill stays the page and the ring takes
    // `checkedColor`; the dot is `checkedColor` too. The recipe used to fill the
    // whole circle with the primary — a value the web never read, and the
    // mobile views did, so a selected radio was a solid disc there.
    selected: {
      true: {
        root: {
          bgColor: "surface-primary",
          borderColor: "interactive-primary",
        },
      },
      false: {
        root: {
          // 선택되지 않은 라디오의 테두리가 유일한 식별자다. `border-primary` 는
          // 흰 배경에서 1.54:1 이었다.
          bgColor: "surface-primary",
          borderColor: "border-strong",
        },
      },
    },
  },
  states: {
    hover: {
      selected: {
        true: { root: { borderColor: "interactive-primary-hover" } },
        false: { root: { borderColor: "interactive-primary-muted" } },
      },
    },
  },
  defaultVariants: { size: "medium", selected: "false" },
});
