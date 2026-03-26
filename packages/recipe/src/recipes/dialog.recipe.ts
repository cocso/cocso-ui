import { defineRecipe } from "../define-recipe";

export const dialogRecipe = defineRecipe({
  name: "dialog",
  slots: ["root"] as const,
  variants: {
    size: {
      small: {
        root: {
          width: 380,
          height: 200,
        },
      },
      medium: {
        root: {
          width: 520,
          height: 260,
        },
      },
      large: {
        root: {
          width: 680,
          height: 340,
        },
      },
    },
  },
  base: {
    root: {
      bgColor: "white",
      borderRadius: "radius-5",
      paddingTop: 36,
      paddingBottom: 36,
      paddingLeft: 36,
      paddingRight: 36,
    },
  },
  defaultVariants: { size: "medium" },
});
