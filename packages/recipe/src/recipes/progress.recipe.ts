import { defineRecipe } from "../define-recipe";

export const progressRecipe = defineRecipe({
  name: "progress",
  slots: ["root"] as const,
  variants: {
    variant: {
      primary: { root: { fillColor: "interactive-primary" } },
      secondary: { root: { fillColor: "text-muted" } },
      success: { root: { fillColor: "feedback-success" } },
      danger: { root: { fillColor: "feedback-danger" } },
      warning: { root: { fillColor: "feedback-warning" } },
      info: { root: { fillColor: "feedback-info" } },
    },
    size: {
      sm: { root: { height: 4, borderRadius: "radius-1" } },
      md: { root: { height: 8, borderRadius: "radius-2" } },
      lg: { root: { height: 12, borderRadius: "radius-3" } },
    },
  },
  base: {
    root: {
      bgColor: "surface-neutral",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export type ProgressVariant = keyof typeof progressRecipe.variants.variant;
export type ProgressSize = keyof typeof progressRecipe.variants.size;
