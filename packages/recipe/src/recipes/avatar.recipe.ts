import { defineRecipe } from "../define-recipe";

export const avatarRecipe = defineRecipe({
  name: "avatar",
  slots: ["root"] as const,

  variants: {
    size: {
      xs: { root: { height: 24, width: 24, fontSize: 10 } },
      sm: { root: { height: 32, width: 32, fontSize: 12 } },
      md: { root: { height: 40, width: 40, fontSize: 14 } },
      lg: { root: { height: 48, width: 48, fontSize: 16 } },
      xl: { root: { height: 64, width: 64, fontSize: 20 } },
    },
    shape: {
      circle: { root: { borderRadius: "100%" } },
      square: { root: {} },
    },
  },

  compoundVariants: [
    {
      conditions: { shape: "square", size: "xs" },
      styles: { root: { borderRadius: "radius-2" } },
    },
    {
      conditions: { shape: "square", size: "sm" },
      styles: { root: { borderRadius: "radius-3" } },
    },
    {
      conditions: { shape: "square", size: ["md", "lg"] },
      styles: { root: { borderRadius: "radius-4" } },
    },
    {
      conditions: { shape: "square", size: "xl" },
      styles: { root: { borderRadius: "radius-5" } },
    },
  ],

  base: {
    root: {
      bgColor: "neutral-100",
      fontColor: "neutral-600",
      fontWeight: "medium",
    },
  },

  defaultVariants: { size: "md", shape: "circle" },
});

export type AvatarSize = keyof typeof avatarRecipe.variants.size;
export type AvatarShape = keyof typeof avatarRecipe.variants.shape;
