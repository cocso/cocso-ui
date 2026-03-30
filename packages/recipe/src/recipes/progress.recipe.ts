import { defineRecipe } from "../define-recipe";

export const progressRecipe = defineRecipe({
  name: "progress",
  slots: ["root"] as const,
  variants: {
    size: {
      sm: { root: { height: 4, borderRadius: "radius-1" } },
      md: { root: { height: 8, borderRadius: "radius-2" } },
      lg: { root: { height: 12, borderRadius: "radius-3" } },
    },
  },
  base: {
    root: {
      bgColor: "neutral-100",
      fillColor: "primary-950",
    },
  },
  defaultVariants: { size: "md" },
});

export type ProgressSize = keyof typeof progressRecipe.variants.size;
