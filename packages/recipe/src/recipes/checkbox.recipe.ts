import { defineRecipe } from "../define-recipe";

export const checkboxRecipe = defineRecipe({
  name: "checkbox",
  slots: ["root"] as const,
  variants: {
    size: {
      large: { root: { size: 18, radius: "radius-3" } },
      medium: { root: { size: 16, radius: "radius-2" } },
      small: { root: { size: 14, radius: "radius-1" } },
    },
    status: {
      on: { root: { borderColor: "primary-950", bgColor: "primary-950" } },
      off: { root: { borderColor: "neutral-100", bgColor: "white" } },
      intermediate: {
        root: { borderColor: "primary-950", bgColor: "primary-950" },
      },
    },
  },
  defaultVariants: { size: "medium", status: "off" },
});
