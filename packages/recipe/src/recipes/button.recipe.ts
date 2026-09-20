import { defineRecipe } from "../define-recipe";

export const buttonRecipe = defineRecipe({
  name: "button",
  slots: ["root"] as const,

  // The label's weight. The web set it from `button.tsx`'s `weight = "medium"`
  // default and nowhere else, so neither mobile view could read it: SwiftUI and
  // Compose drew the label at 400 while every web button was 500.
  base: {
    root: { fontWeight: "medium" },
  },

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
      // `outline` with a fill of its own: a raised control on a surface that is
      // not the page. `outline` and `ghost` are see-through, which reads as a
      // white pill on a white page and as nothing on a tinted one — the mobile
      // app was painting a white slab behind an outline button by hand, sized to
      // the pill, and a label that grew past it left the slab showing.
      surface: {
        root: {
          bgColor: "surface-primary",
          fontColor: "text-primary",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "border-secondary" as const,
          },
        },
      },
      // See-through, like `error-ghost`. It filled `surface-primary`, which is
      // invisible on a white page and a white pill on any other surface — next
      // to a transparent `error-ghost` the two read as different weights. The
      // hover state still fills `surface-secondary`.
      ghost: {
        root: { bgColor: "transparent", fontColor: "text-primary" },
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
      // The entry to something that cannot be undone: `error-ghost` with an
      // edge, so it reads as a control before it reads as a warning, and the
      // red fill stays for the confirmation that follows. The app drew this
      // border itself, and once buttons grew a touch target it could no longer
      // find the pill to draw it on — the edge belongs to the recipe, where the
      // views draw it on the pill and not the row.
      "error-outline": {
        root: {
          bgColor: "transparent",
          fontColor: "feedback-danger-text",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "feedback-danger-border" as const,
          },
        },
      },
      // Glass: the tint of a pane over whatever is beneath, with the ink of the
      // page. For the floating controls — a composer's actions, a pill over a
      // photo. The web and SwiftUI blur what is beneath; Compose composites the
      // same tint over the page surface, so it reads as a solid there.
      glass: {
        root: {
          bgColor: "surface-glass",
          fontColor: "text-primary",
          border: {
            _type: "border" as const,
            width: 1,
            style: "solid" as const,
            color: "border-glass" as const,
          },
        },
      },
    },
    size: {
      // The full-width call to action a phone screen ends on. cocso/mobile drew
      // its button at 56 by hand because nothing here reached that height;
      // adding the size is what lets it stop deciding for itself.
      "x-large": {
        root: {
          height: 56,
          paddingInline: 16,
          contentPadding: "0 6px",
          fontSize: 16,
        },
      },
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
    // The radius follows the size — 6 at x-small, 8 through large — and a
    // 56px control at 8 reads as nearly square. 16 keeps the proportion;
    // it is also within 2px of what cocso/mobile drew by hand.
    {
      conditions: { shape: "square", size: "x-large" },
      styles: { root: { borderRadius: "radius-6" } },
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
        surface: { root: { bgColor: "surface-secondary" } },
        ghost: { root: { bgColor: "surface-secondary" } },
        success: { root: { bgColor: "interactive-success-hover" } },
        error: { root: { bgColor: "interactive-danger-hover" } },
        warning: { root: { bgColor: "interactive-warning-hover" } },
        info: { root: { bgColor: "interactive-info-hover" } },
        neutral: { root: { bgColor: "interactive-neutral-hover" } },
        "error-ghost": {
          root: { bgColor: "interactive-danger-subtle-hover" },
        },
        "error-outline": {
          root: { bgColor: "interactive-danger-subtle-hover" },
        },
        glass: { root: { bgColor: "surface-glass-active" } },
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
        surface: { root: { bgColor: "interactive-secondary" } },
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
        "error-outline": {
          root: { bgColor: "interactive-danger-subtle-active" },
        },
        glass: { root: { bgColor: "surface-glass-active" } },
      },
    },
    // An inactive control, drawn rather than faded. Every platform made this
    // with `opacity: 0.4` over the whole button, which takes the label down
    // with the fill: a disabled primary button's label measured 1.76:1, and the
    // two screens that open the app — the terms agreement and the dealer code —
    // are where it showed. Separating the fill from the label puts the contrast
    // in values: 5.13 in light, 6.03 in dark.
    //
    // The see-through variants keep their own background and change only their
    // ink; a disabled `ghost` is still see-through, as it is on the web.
    disabled: {
      variant: {
        primary: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        secondary: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        success: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        error: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        warning: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        info: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        neutral: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        glass: {
          root: {
            bgColor: "interactive-disabled",
            fontColor: "text-on-disabled",
          },
        },
        outline: { root: { fontColor: "text-on-disabled" } },
        surface: { root: { fontColor: "text-on-disabled" } },
        ghost: { root: { fontColor: "text-on-disabled" } },
        "error-ghost": { root: { fontColor: "text-on-disabled" } },
        "error-outline": { root: { fontColor: "text-on-disabled" } },
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
