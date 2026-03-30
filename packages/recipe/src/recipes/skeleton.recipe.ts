import { defineRecipe } from "../define-recipe";

export const skeletonRecipe = defineRecipe({
  name: "skeleton",
  slots: ["root"] as const,
  variants: {
    variant: {
      text: { root: { height: 16, borderRadius: "radius-2" } },
      circular: { root: { height: 40, width: 40, borderRadius: "100%" } },
      rectangular: { root: { height: 120, borderRadius: "radius-4" } },
    },
    animation: {
      pulse: { root: {} },
      wave: { root: {} },
      none: { root: {} },
    },
  },
  base: {
    root: {
      bgColor: "neutral-100",
    },
  },
  defaultVariants: { variant: "text", animation: "pulse" },
});

export type SkeletonVariant = keyof typeof skeletonRecipe.variants.variant;
export type SkeletonAnimation = keyof typeof skeletonRecipe.variants.animation;
