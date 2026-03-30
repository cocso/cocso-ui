import { defineRecipe } from "../define-recipe";

export const stockQuantityStatusRecipe = defineRecipe({
  name: "stock-quantity-status",
  slots: ["root"] as const,
  variants: {
    quantity: {
      sufficient: { root: { color: "info-500" } },
      normal: { root: { color: "success-400" } },
      insufficient: { root: { color: "danger-500" } },
    },
  },
  defaultVariants: { quantity: "sufficient" },
});
