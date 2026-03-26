import { defineRecipe } from "../define-recipe";

export const buttonRecipe = defineRecipe({
  name: "button",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: { root: { bgColor: "primary-950", fontColor: "white" } },
      secondary: { root: { bgColor: "neutral-50", fontColor: "neutral-600" } },
      outline: {
        root: {
          bgColor: "transparent",
          fontColor: "neutral-950",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "neutral-100" as const,
          },
        },
      },
      ghost: { root: { bgColor: "white", fontColor: "neutral-950" } },
      success: { root: { bgColor: "success-500", fontColor: "white" } },
      error: { root: { bgColor: "danger-500", fontColor: "white" } },
      warning: { root: { bgColor: "warning-300", fontColor: "neutral-950" } },
      info: { root: { bgColor: "info-500", fontColor: "white" } },
    },
    size: {
      large: {
        root: {
          height: 40,
          paddingInline: 14,
          contentPadding: "0 6px",
          fontSize: 14,
        },
      },
      medium: {
        root: {
          height: 36,
          paddingInline: 12,
          contentPadding: "0 6px",
          fontSize: 14,
        },
      },
      small: {
        root: {
          height: 32,
          paddingInline: 10,
          contentPadding: "0 2px",
          fontSize: 14,
        },
      },
      "x-small": {
        root: {
          height: 28,
          paddingInline: 8,
          contentPadding: "0",
          fontSize: 12,
        },
      },
    },
    shape: {
      square: { root: {} },
      circle: { root: { borderRadius: "100%" } },
      rounded: { root: { borderRadius: "radius-full" } },
    },
  },

  compoundVariants: [
    {
      conditions: { shape: "square", size: "x-small" },
      styles: { root: { borderRadius: "radius-3" } },
    },
    {
      conditions: { shape: "square", size: ["large", "medium", "small"] },
      styles: { root: { borderRadius: "radius-4" } },
    },
  ],

  states: {
    hover: {
      primary: { root: { bgColor: "primary-800" } },
      secondary: { root: { bgColor: "neutral-100" } },
      outline: { root: { bgColor: "neutral-50" } },
      ghost: { root: { bgColor: "neutral-50" } },
      success: { root: { bgColor: "success-600" } },
      error: { root: { bgColor: "danger-600" } },
      warning: { root: { bgColor: "warning-400" } },
      info: { root: { bgColor: "info-600" } },
    },
    active: {
      primary: { root: { bgColor: "primary-700" } },
      secondary: { root: { bgColor: "neutral-200" } },
      outline: { root: { bgColor: "neutral-100" } },
      ghost: { root: { bgColor: "neutral-100" } },
      success: { root: { bgColor: "success-700" } },
      error: { root: { bgColor: "danger-700" } },
      warning: { root: { bgColor: "warning-500" } },
      info: { root: { bgColor: "info-700" } },
    },
  },

  defaultVariants: { variant: "primary", size: "medium", shape: "square" },
});

export type ButtonVariant = keyof typeof buttonRecipe.variants.variant;
export type ButtonSize = keyof typeof buttonRecipe.variants.size;
export type ButtonShape = keyof typeof buttonRecipe.variants.shape;
