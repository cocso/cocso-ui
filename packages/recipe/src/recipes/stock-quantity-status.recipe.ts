import { defineRecipe } from "../define-recipe";

export const stockQuantityStatusRecipe = defineRecipe({
  name: "stock-quantity-status",
  slots: ["root"] as const,
  variants: {
    quantity: {
      sufficient: { root: { color: "feedback-info" } },
      normal: { root: { color: "feedback-success-muted" } },
      insufficient: { root: { color: "feedback-danger" } },
    },
  },
  defaultVariants: { quantity: "sufficient" },
});
