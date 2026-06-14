import { defineRecipe } from "../define-recipe";

export const selectRecipe = defineRecipe({
  name: "select",
  slots: ["root"] as const,

  variants: {
    size: {
      "x-small": {
        root: {
          minWidth: 28,
          height: 28,
          paddingLeft: 8,
          paddingRight: 26,
          iconRight: 8,
          fontSize: 12,
          borderRadius: "radius-3",
        },
      },
      small: {
        root: {
          minWidth: 32,
          height: 32,
          paddingLeft: 10,
          paddingRight: 32,
          iconRight: 10,
          fontSize: 12,
          borderRadius: "radius-3",
        },
      },
      medium: {
        root: {
          minWidth: 36,
          height: 36,
          paddingLeft: 12,
          paddingRight: 38,
          iconRight: 12,
          fontSize: 14,
          borderRadius: "radius-4",
        },
      },
      large: {
        root: {
          minWidth: 40,
          height: 40,
          paddingLeft: 14,
          paddingRight: 42,
          iconRight: 14,
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
