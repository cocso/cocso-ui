import { defineRecipe } from "../define-recipe";

export const paginationRecipe = defineRecipe({
  name: "pagination",
  slots: ["root"] as const,
  variants: {
    pageState: {
      active: {
        root: {
          bgColor: "interactive-primary",
          fontColor: "text-on-primary",
          fontWeight: 600,
        },
      },
      inactive: {
        root: {
          fontColor: "text-primary",
        },
      },
      disabled: {
        root: {
          fontColor: "text-disabled",
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
        active: { root: { bgColor: "interactive-primary-hover" } },
        inactive: { root: { bgColor: "interactive-secondary" } },
        disabled: { root: {} },
      },
    },
  },
  defaultVariants: { pageState: "inactive" },
});
