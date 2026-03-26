import { defineRecipe } from "../define-recipe";

export const linkRecipe = defineRecipe({
  name: "link",
  slots: ["root"] as const,
  variants: {
    variant: {
      inline: { root: { color: "info-500" } },
      current: { root: { color: "currentColor" } },
      plain: { root: { color: "info-500" } },
    },
  },
  states: {
    hover: {
      inline: { root: { color: "info-700" } },
      current: { root: { color: "currentColor" } },
      plain: { root: { color: "info-700" } },
    },
  },
  defaultVariants: { variant: "inline" },
});
