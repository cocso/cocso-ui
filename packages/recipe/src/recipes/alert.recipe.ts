import { defineRecipe } from "../define-recipe";

export const alertRecipe = defineRecipe({
  name: "alert",
  slots: ["root"] as const,
  variants: {
    variant: {
      info: { root: { bgColor: "info-50", fontColor: "info-600", borderColor: "info-200" } },
      success: { root: { bgColor: "success-50", fontColor: "success-600", borderColor: "success-200" } },
      warning: { root: { bgColor: "warning-50", fontColor: "warning-600", borderColor: "warning-200" } },
      error: { root: { bgColor: "danger-50", fontColor: "danger-600", borderColor: "danger-200" } },
    },
  },
  base: {
    root: {
      borderRadius: "radius-4",
      padding: "12px 16px",
      fontSize: 14,
    },
  },
  defaultVariants: { variant: "info" },
});

export type AlertVariant = keyof typeof alertRecipe.variants.variant;
