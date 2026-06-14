import { defineRecipe } from "../define-recipe";

export const radioGroupRecipe = defineRecipe({
  name: "radio",
  slots: ["root"] as const,
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
