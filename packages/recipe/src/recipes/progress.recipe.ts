import { defineRecipe } from "../define-recipe";

export const progressRecipe = defineRecipe({
  name: "progress",
  slots: ["root"] as const,
  variants: {
    variant: {
      primary: { root: { fillColor: "primary-950" } },
      secondary: { root: { fillColor: "neutral-500" } },
      success: { root: { fillColor: "success-500" } },
      danger: { root: { fillColor: "danger-500" } },
      warning: { root: { fillColor: "warning-500" } },
      info: { root: { fillColor: "info-500" } },
    },
    size: {
      sm: { root: { height: 4, borderRadius: "radius-1" } },
      md: { root: { height: 8, borderRadius: "radius-2" } },
      lg: { root: { height: 12, borderRadius: "radius-3" } },
    },
  },
  base: {
    root: {
      bgColor: "neutral-100",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export type ProgressVariant = keyof typeof progressRecipe.variants.variant;
export type ProgressSize = keyof typeof progressRecipe.variants.size;
