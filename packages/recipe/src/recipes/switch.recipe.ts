import { defineRecipe } from "../define-recipe";

export const switchRecipe = defineRecipe({
  name: "switch",
  slots: ["root"] as const,
  variants: {
    variant: {
      primary: { root: { checkedBgColor: "primary-950" } },
      success: { root: { checkedBgColor: "success-500" } },
      error: { root: { checkedBgColor: "danger-500" } },
      warning: { root: { checkedBgColor: "warning-500" } },
      info: { root: { checkedBgColor: "info-500" } },
    },
    size: {
      large: { root: { width: 40, height: 22, thumbSize: 18, thumbOffset: 2 } },
      medium: {
        root: { width: 36, height: 20, thumbSize: 16, thumbOffset: 2 },
      },
      small: { root: { width: 32, height: 18, thumbSize: 14, thumbOffset: 2 } },
    },
  },
  defaultVariants: { variant: "primary", size: "medium" },
});

export type SwitchVariant = keyof typeof switchRecipe.variants.variant;
export type SwitchSize = keyof typeof switchRecipe.variants.size;
