import { defineRecipe } from "../define-recipe";

export const breadcrumbRecipe = defineRecipe({
  name: "breadcrumb",
  slots: ["root"] as const,
  variants: {
    size: {
      sm: { root: { fontSize: 12 } },
      md: { root: { fontSize: 14 } },
      lg: { root: { fontSize: 16 } },
    },
  },
  base: {
    root: {
      // `text-muted` is 4.09:1 on the dark theme's surface and 4.13:1 on the
      // light theme's `surface-secondary` — under AA for the 12/14/16px sizes
      // this component renders. Crumbs are navigation text, not decoration.
      fontColor: "text-secondary",
    },
  },
  defaultVariants: { size: "md" },
});

export type BreadcrumbSize = keyof typeof breadcrumbRecipe.variants.size;
