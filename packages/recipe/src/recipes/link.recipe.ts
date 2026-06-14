import { defineRecipe } from "../define-recipe";

export const linkRecipe = defineRecipe({
  name: "link",
  slots: ["root"] as const,
  variants: {
    variant: {
      inline: { root: { color: "interactive-info" } },
      current: { root: { color: "currentColor" } },
      plain: { root: { color: "interactive-info" } },
    },
  },
  states: {
    hover: {
      variant: {
        inline: { root: { color: "interactive-info-active" } },
        current: { root: { color: "currentColor" } },
        plain: { root: { color: "interactive-info-active" } },
      },
    },
  },
  defaultVariants: { variant: "inline" },
});
