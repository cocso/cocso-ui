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
      borderColor: "neutral-200",
    },
  },
  states: {
    hover: {
      size: {
        "x-small": { root: { borderColor: "primary-500" } },
        small: { root: { borderColor: "primary-500" } },
        medium: { root: { borderColor: "primary-500" } },
        large: { root: { borderColor: "primary-500" } },
      },
    },
    focus: {
      size: {
        "x-small": { root: { borderColor: "primary-700" } },
        small: { root: { borderColor: "primary-700" } },
        medium: { root: { borderColor: "primary-700" } },
        large: { root: { borderColor: "primary-700" } },
      },
    },
  },
  defaultVariants: { size: "medium" },
});
