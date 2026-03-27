import { defineRecipe } from "../define-recipe";

export const typographyRecipe = defineRecipe({
  name: "typography",
  slots: ["root"] as const,
  variants: {
    type: {
      body: { root: {} },
      heading: { root: { fontWeight: 700 } },
    },
    size: {
      "x-large": { root: { fontSize: 28 } },
      large: { root: { fontSize: 24 } },
      medium: { root: { fontSize: 20 } },
      small: { root: { fontSize: 16 } },
      "x-small": { root: { fontSize: 14 } },
    },
  },
  compoundVariants: [
    {
      conditions: { type: "body", size: "x-large" },
      styles: { root: { fontSize: 18 } },
    },
    {
      conditions: { type: "body", size: "large" },
      styles: { root: { fontSize: 18 } },
    },
    {
      conditions: { type: "body", size: "medium" },
      styles: { root: { fontSize: 16 } },
    },
    {
      conditions: { type: "body", size: "small" },
      styles: { root: { fontSize: 14 } },
    },
    {
      conditions: { type: "body", size: "x-small" },
      styles: { root: { fontSize: 12 } },
    },
  ],
  defaultVariants: { type: "body", size: "medium" },
});
