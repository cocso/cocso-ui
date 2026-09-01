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
        root: { bgColor: "interactive-success", fontColor: "text-on-success" },
      },
      error: {
        root: { bgColor: "interactive-danger", fontColor: "text-on-danger" },
      },
      warning: {
        root: { bgColor: "interactive-warning", fontColor: "text-on-warning" },
      },
      info: {
        root: { bgColor: "interactive-info", fontColor: "text-on-info" },
      },
      neutral: {
        root: { bgColor: "interactive-neutral", fontColor: "text-primary" },
      },
      "error-ghost": {
        root: { bgColor: "transparent", fontColor: "feedback-danger-text" },
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
      sharp: { root: { borderRadius: "0" } },
    },
    align: {
      center: { root: { justifyContent: "center" } },
      start: { root: { justifyContent: "flex-start" } },
      between: { root: { justifyContent: "space-between" } },
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
        secondary: {
          root: {
            bgColor: "interactive-secondary",
            // Same reason as the pressed state: the fill steps toward the
            // label, so the label steps away from the fill.
            fontColor: "text-primary",
          },
        },
        outline: { root: { bgColor: "surface-secondary" } },
        ghost: { root: { bgColor: "surface-secondary" } },
        success: { root: { bgColor: "interactive-success-hover" } },
        error: { root: { bgColor: "interactive-danger-hover" } },
        warning: { root: { bgColor: "interactive-warning-hover" } },
        info: { root: { bgColor: "interactive-info-hover" } },
        neutral: { root: { bgColor: "interactive-neutral-hover" } },
        "error-ghost": {
          root: { bgColor: "interactive-danger-subtle-hover" },
        },
      },
    },
    active: {
      variant: {
        primary: { root: { bgColor: "interactive-primary-active" } },
        secondary: {
          root: {
            bgColor: "interactive-secondary-hover",
            // neutral-200 under `text-secondary` is 4.10:1; the label steps to
            // `text-primary` so the pressed state stays readable.
            fontColor: "text-primary",
          },
        },
        outline: { root: { bgColor: "interactive-secondary" } },
        ghost: { root: { bgColor: "interactive-secondary" } },
        success: { root: { bgColor: "interactive-success-active" } },
        error: { root: { bgColor: "interactive-danger-active" } },
        // `interactive-warning-active` (warning-500) under the dark label is
        // 3.96:1, so the pressed fill stops at the hover step. Warning is the
        // only variant whose ramp runs out before the third state.
        warning: { root: { bgColor: "interactive-warning-hover" } },
        info: { root: { bgColor: "interactive-info-active" } },
        neutral: { root: { bgColor: "interactive-neutral-active" } },
        "error-ghost": {
          root: { bgColor: "interactive-danger-subtle-active" },
        },
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
    shape: "square",
    align: "center",
  },
});

export type ButtonVariant = keyof typeof buttonRecipe.variants.variant;
export type ButtonSize = keyof typeof buttonRecipe.variants.size;
export type ButtonShape = keyof typeof buttonRecipe.variants.shape;
export type ButtonAlign = keyof typeof buttonRecipe.variants.align;
