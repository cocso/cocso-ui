import { defineRecipe } from "../define-recipe";

export const linkRecipe = defineRecipe({
  name: "link",
  slots: ["root"] as const,
  variants: {
    variant: {
      inline: { root: { color: "interactive-info-text" } },
      current: { root: { color: "currentColor" } },
      plain: { root: { color: "interactive-info-text" } },
    },
  },
  states: {
    hover: {
      variant: {
        inline: { root: { color: "interactive-info-text-hover" } },
        current: { root: { color: "currentColor" } },
        plain: { root: { color: "interactive-info-text-hover" } },
      },
    },
  },
  defaultVariants: { variant: "inline" },
});
