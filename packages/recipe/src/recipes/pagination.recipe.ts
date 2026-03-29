import { defineRecipe } from "../define-recipe";

export const paginationRecipe = defineRecipe({
  name: "pagination",
  slots: ["root"] as const,
  variants: {
    pageState: {
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
      height: 32,
      width: 32,
      borderRadius: "radius-4",
      fontSize: 14,
    },
  },
  states: {
    hover: {
      pageState: {
        active: { root: { bgColor: "primary-800" } },
        inactive: { root: { bgColor: "neutral-100" } },
        disabled: { root: {} },
      },
    },
  },
  defaultVariants: { pageState: "inactive" },
});
