import { defineRecipe } from "../define-recipe";

export const tagRecipe = defineRecipe({
  name: "tag",
  slots: ["root"] as const,
  variants: {
    variant: {
      solid: { root: { bgColor: "primary-950", fontColor: "white" } },
      subtle: { root: { bgColor: "primary-50", fontColor: "primary-950" } },
      outline: {
        root: {
          bgColor: "transparent",
          fontColor: "primary-950",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "primary-200" as const,
          },
        },
      },
    },
    size: {
      sm: {
        root: { height: 22, paddingInline: 6, fontSize: 11, borderRadius: "radius-2" },
      },
      md: {
        root: { height: 26, paddingInline: 8, fontSize: 12, borderRadius: "radius-3" },
      },
      lg: {
        root: { height: 30, paddingInline: 10, fontSize: 13, borderRadius: "radius-3" },
      },
    },
  },
  base: {
    root: { fontWeight: "medium" },
  },
  defaultVariants: { variant: "subtle", size: "md" },
});

export type TagVariant = keyof typeof tagRecipe.variants.variant;
export type TagSize = keyof typeof tagRecipe.variants.size;
