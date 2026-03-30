import { defineRecipe } from "../define-recipe";

export const cardRecipe = defineRecipe({
  name: "card",
  slots: ["root"] as const,
  variants: {
    variant: {
      elevated: { root: { bgColor: "white", borderRadius: "radius-4" } },
      outlined: {
        root: {
          bgColor: "white",
          borderRadius: "radius-4",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "neutral-100" as const,
          },
        },
      },
      filled: { root: { bgColor: "neutral-50", borderRadius: "radius-4" } },
    },
    padding: {
      sm: { root: { padding: "12px" } },
      md: { root: { padding: "16px" } },
      lg: { root: { padding: "24px" } },
    },
  },
  defaultVariants: { variant: "elevated", padding: "md" },
});

export type CardVariant = keyof typeof cardRecipe.variants.variant;
export type CardPadding = keyof typeof cardRecipe.variants.padding;
