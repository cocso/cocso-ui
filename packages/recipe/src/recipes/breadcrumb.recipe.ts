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
      fontColor: "neutral-500",
    },
  },
  defaultVariants: { size: "md" },
});

export type BreadcrumbSize = keyof typeof breadcrumbRecipe.variants.size;
