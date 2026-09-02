import { defineRecipe } from "../define-recipe";

export const stockQuantityStatusRecipe = defineRecipe({
  name: "stock-quantity-status",
  slots: ["root"] as const,
  variants: {
    quantity: {
      sufficient: { root: { color: "feedback-info" } },
      // `feedback-success`, not `-muted`: the muted step is `success-400`, which
      // is 3.09:1 on white — this is body-size text, so it needs AA. The base is
      // 4.57:1 in the light theme and 5.96:1 in the dark one.
      normal: { root: { color: "feedback-success" } },
      insufficient: { root: { color: "feedback-danger" } },
    },
  },
  defaultVariants: { quantity: "sufficient" },
});
