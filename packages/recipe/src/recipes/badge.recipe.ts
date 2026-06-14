import { defineRecipe } from "../define-recipe";

export const badgeRecipe = defineRecipe({
  name: "badge",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: {
        root: { bgColor: "interactive-primary", fontColor: "text-on-primary" },
      },
      secondary: {
        root: { bgColor: "surface-secondary", fontColor: "text-secondary" },
      },
      success: {
        root: {
          bgColor: "feedback-success-subtle",
          fontColor: "feedback-success-text",
        },
      },
      error: {
        root: {
          bgColor: "feedback-danger-subtle",
          fontColor: "feedback-danger-text",
        },
      },
      warning: {
        root: {
          bgColor: "feedback-warning-subtle",
          fontColor: "feedback-warning-text",
        },
      },
      info: {
        root: {
          bgColor: "feedback-info-subtle",
          fontColor: "feedback-info-text",
        },
      },
      outline: {
        root: {
          bgColor: "transparent",
          fontColor: "text-primary",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "border-secondary" as const,
          },
        },
      },
    },
    size: {
      large: { root: { padding: "5px 10px", fontSize: 14 } },
      medium: { root: { padding: "4px 8px", fontSize: 12 } },
      small: { root: { padding: "3px 6px", fontSize: 11 } },
    },
    shape: {
      square: { root: {} },
      circle: { root: { borderRadius: "100%" } },
      rounded: { root: { borderRadius: "radius-full" } },
    },
  },

  compoundVariants: [
    {
      conditions: { shape: "square", size: "small" },
      styles: { root: { borderRadius: "radius-3" } },
    },
    {
      conditions: { shape: "square", size: ["large", "medium"] },
      styles: { root: { borderRadius: "radius-4" } },
    },
  ],

  defaultVariants: { variant: "secondary", size: "medium", shape: "square" },
});

export type BadgeVariant = keyof typeof badgeRecipe.variants.variant;
export type BadgeSize = keyof typeof badgeRecipe.variants.size;
export type BadgeShape = keyof typeof badgeRecipe.variants.shape;
