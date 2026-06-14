import { defineRecipe } from "../define-recipe";

export const inputRecipe = defineRecipe({
  name: "input",
  slots: ["root"] as const,
  variants: {
    size: {
      "x-small": {
        root: {
          height: 28,
          paddingX: 8,
          fontSize: 12,
          borderRadius: "radius-3",
        },
      },
      small: {
        root: {
          height: 32,
          paddingX: 10,
          fontSize: 12,
          borderRadius: "radius-3",
        },
      },
      medium: {
        root: {
          height: 36,
          paddingX: 12,
          fontSize: 14,
          borderRadius: "radius-4",
        },
      },
      large: {
        root: {
          height: 40,
          paddingX: 14,
          fontSize: 14,
          borderRadius: "radius-4",
        },
      },
    },
  },
  base: {
    root: {
      borderColor: "border-primary",
    },
  },
  states: {
    hover: {
      size: {
        "x-small": { root: { borderColor: "interactive-primary-muted" } },
        small: { root: { borderColor: "interactive-primary-muted" } },
        medium: { root: { borderColor: "interactive-primary-muted" } },
        large: { root: { borderColor: "interactive-primary-muted" } },
      },
    },
    focus: {
      size: {
        "x-small": { root: { borderColor: "interactive-primary-active" } },
        small: { root: { borderColor: "interactive-primary-active" } },
        medium: { root: { borderColor: "interactive-primary-active" } },
        large: { root: { borderColor: "interactive-primary-active" } },
      },
    },
  },
  defaultVariants: { size: "medium" },
});
