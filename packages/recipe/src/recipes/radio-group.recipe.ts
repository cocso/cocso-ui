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
    selected: {
      true: {
        root: {
          bgColor: "interactive-primary",
          borderColor: "interactive-primary",
        },
      },
      false: {
        root: { bgColor: "surface-primary", borderColor: "border-primary" },
      },
    },
  },
  states: {
    hover: {
      selected: {
        true: {
          root: {
            bgColor: "interactive-primary-hover",
            borderColor: "interactive-primary-hover",
          },
        },
        false: { root: { borderColor: "interactive-primary-muted" } },
      },
    },
  },
  defaultVariants: { size: "medium", selected: "false" },
});
