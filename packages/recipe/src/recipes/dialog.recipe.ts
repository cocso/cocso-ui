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
      border: {
        _type: "border" as const,
        width: 1,
        style: "solid" as const,
        color: "neutral-100" as const,
      },
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
    },
  },
  defaultVariants: { size: "medium" },
});
