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
      on: {
        root: {
          borderColor: "interactive-primary",
          bgColor: "interactive-primary",
        },
      },
      off: {
        root: { borderColor: "border-secondary", bgColor: "surface-primary" },
      },
      intermediate: {
        root: {
          borderColor: "interactive-primary",
          bgColor: "interactive-primary",
        },
      },
    },
  },
  states: {
    hover: {
      status: {
        on: {
          root: {
            bgColor: "interactive-primary-hover",
            borderColor: "interactive-primary-hover",
          },
        },
        off: {
          root: {
            bgColor: "interactive-secondary-hover",
            borderColor: "interactive-secondary-hover",
          },
        },
        intermediate: {
          root: {
            bgColor: "interactive-primary-hover",
            borderColor: "interactive-primary-hover",
          },
        },
      },
    },
  },
  defaultVariants: { size: "medium", status: "off" },
});
