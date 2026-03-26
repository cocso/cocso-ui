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
  },
  defaultVariants: { size: "medium" },
});
