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
