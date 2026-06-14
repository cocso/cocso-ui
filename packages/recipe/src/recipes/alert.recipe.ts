import { defineRecipe } from "../define-recipe";

export const alertRecipe = defineRecipe({
  name: "alert",
  slots: ["root"] as const,
  variants: {
    variant: {
      info: {
        root: {
          bgColor: "feedback-info-subtle",
          fontColor: "feedback-info-text",
          borderColor: "feedback-info-border",
        },
      },
      success: {
        root: {
          bgColor: "feedback-success-subtle",
          fontColor: "feedback-success-text",
          borderColor: "feedback-success-border",
        },
      },
      warning: {
        root: {
          bgColor: "feedback-warning-subtle",
          fontColor: "feedback-warning-text",
          borderColor: "feedback-warning-border",
        },
      },
      error: {
        root: {
          bgColor: "feedback-danger-subtle",
          fontColor: "feedback-danger-text",
          borderColor: "feedback-danger-border",
        },
      },
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
