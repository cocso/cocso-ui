import { defineRecipe } from "../define-recipe";

export const paginationRecipe = defineRecipe({
  name: "pagination",
  slots: ["root"] as const,
  variants: {
    state: {
      active: {
        root: {
          bgColor: "primary-950",
          fontColor: "white",
          fontWeight: 600,
        },
      },
      inactive: {
        root: {
          fontColor: "neutral-900",
        },
      },
      disabled: {
        root: {
          fontColor: "neutral-400",
        },
      },
    },
  },
  base: {
    root: {
      height: 48,
      width: 48,
      borderRadius: "radius-4",
      fontSize: 14,
    },
  },
  defaultVariants: { state: "inactive" },
});
