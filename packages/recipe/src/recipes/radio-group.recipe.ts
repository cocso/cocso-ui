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
      true: { root: { bgColor: "primary-950", borderColor: "primary-950" } },
      false: { root: { bgColor: "white", borderColor: "neutral-200" } },
    },
  },
  states: {
    hover: {
      selected: {
        true: { root: { bgColor: "primary-800", borderColor: "primary-800" } },
        false: { root: { borderColor: "primary-500" } },
      },
    },
  },
  defaultVariants: { size: "medium", selected: "false" },
});
