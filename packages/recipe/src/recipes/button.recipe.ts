import { defineRecipe } from "../define-recipe";

export const buttonRecipe = defineRecipe({
  name: "button",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: {
        root: { bgColor: "interactive-primary", fontColor: "text-on-primary" },
      },
      secondary: {
        root: { bgColor: "surface-secondary", fontColor: "text-secondary" },
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
      ghost: {
        root: { bgColor: "surface-primary", fontColor: "text-primary" },
      },
      success: {
        root: { bgColor: "interactive-success", fontColor: "text-on-primary" },
      },
      error: {
        root: { bgColor: "interactive-danger", fontColor: "text-on-primary" },
      },
      warning: {
        root: { bgColor: "interactive-warning", fontColor: "text-primary" },
      },
      info: {
        root: { bgColor: "interactive-info", fontColor: "text-on-primary" },
      },
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
      variant: {
        primary: { root: { bgColor: "interactive-primary-hover" } },
        secondary: { root: { bgColor: "interactive-secondary" } },
        outline: { root: { bgColor: "surface-secondary" } },
        ghost: { root: { bgColor: "surface-secondary" } },
        success: { root: { bgColor: "interactive-success-hover" } },
        error: { root: { bgColor: "interactive-danger-hover" } },
        warning: { root: { bgColor: "interactive-warning-hover" } },
        info: { root: { bgColor: "interactive-info-hover" } },
      },
    },
    active: {
      variant: {
        primary: { root: { bgColor: "interactive-primary-active" } },
        secondary: { root: { bgColor: "interactive-secondary-hover" } },
        outline: { root: { bgColor: "interactive-secondary" } },
        ghost: { root: { bgColor: "interactive-secondary" } },
        success: { root: { bgColor: "interactive-success-active" } },
        error: { root: { bgColor: "interactive-danger-active" } },
        warning: { root: { bgColor: "interactive-warning-active" } },
        info: { root: { bgColor: "interactive-info-active" } },
      },
    },
  },

  defaultVariants: { variant: "primary", size: "medium", shape: "square" },
});

export type ButtonVariant = keyof typeof buttonRecipe.variants.variant;
export type ButtonSize = keyof typeof buttonRecipe.variants.size;
export type ButtonShape = keyof typeof buttonRecipe.variants.shape;
