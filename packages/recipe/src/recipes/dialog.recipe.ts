import { defineRecipe } from "../define-recipe";

export const dialogRecipe = defineRecipe({
  name: "dialog",
  slots: ["root"] as const,
  variants: {
    size: {
      // Width only. A height sat here for as long as the recipe existed and the
      // web never read it (`dialog.module.css` caps at 85vh); the mobile views
      // did, and a two-line dialog came out 260 tall.
      small: { root: { width: 380 } },
      medium: { root: { width: 520 } },
      large: { root: { width: 680 } },
    },
  },
  base: {
    root: {
      bgColor: "surface-primary",
      borderRadius: "radius-5",
      border: {
        _type: "border" as const,
        width: 1,
        style: "solid" as const,
        color: "border-secondary" as const,
      },
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
    },
  },
  defaultVariants: { size: "medium" },
});
