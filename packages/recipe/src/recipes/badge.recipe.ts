import { defineRecipe } from "../define-recipe";

export const badgeRecipe = defineRecipe({
  name: "badge",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: { root: { bgColor: "primary-950", fontColor: "white" } },
      secondary: { root: { bgColor: "neutral-50", fontColor: "neutral-600" } },
      success: { root: { bgColor: "success-50", fontColor: "success-600" } },
      error: { root: { bgColor: "danger-50", fontColor: "danger-600" } },
      warning: { root: { bgColor: "warning-50", fontColor: "warning-600" } },
      info: { root: { bgColor: "info-50", fontColor: "info-600" } },
      outline: {
        root: {
          bgColor: "transparent",
          fontColor: "neutral-950",
          border: {
            width: 1,
            style: "solid" as const,
            color: "neutral-100" as const,
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
