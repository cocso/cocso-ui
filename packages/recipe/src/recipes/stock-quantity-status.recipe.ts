import { defineRecipe } from "../define-recipe";

export const stockQuantityStatusRecipe = defineRecipe({
  name: "stock-quantity-status",
  slots: ["root"] as const,
  variants: {
    quantity: {
      여유: { root: { color: "info-500" } },
      보통: { root: { color: "success-400" } },
      부족: { root: { color: "danger-500" } },
    },
  },
  defaultVariants: { quantity: "여유" },
});
