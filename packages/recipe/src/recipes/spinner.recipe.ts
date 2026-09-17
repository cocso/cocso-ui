import { defineRecipe } from "../define-recipe";

export const spinnerRecipe = defineRecipe({
  name: "spinner",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: { root: { bladeColor: "interactive-primary" } },
      secondary: { root: { bladeColor: "text-muted" } },
      success: { root: { bladeColor: "feedback-success" } },
      error: { root: { bladeColor: "feedback-danger" } },
      warning: { root: { bladeColor: "feedback-warning" } },
      info: { root: { bladeColor: "feedback-info" } },
      // White in both themes, which is what the name and the docs promise: a
      // spinner over a photo or a dark scrim. It was `surface-primary`, which
      // turns near-black in dark — invisible on exactly the backgrounds it is
      // for, and dark on the red, green and blue button fills whose labels
      // stay white.
      white: { root: { bladeColor: "white" } },
      // The ink on a primary fill, for the primary button's loading state. The
      // base primary inverts in dark (a light fill under a dark label) and a
      // brand's may not, so the colour is the token that already tracks both.
      "on-primary": { root: { bladeColor: "text-on-primary" } },
    },
    size: {
      large: {
        root: {
          blades: 10,
          bladeWidth: 2,
          bladeHeight: 6,
          bladeRadius: 1,
          output: 20,
        },
      },
      medium: {
        root: {
          blades: 8,
          bladeWidth: 2,
          bladeHeight: 5,
          bladeRadius: 1,
          output: 16,
        },
      },
      small: {
        root: {
          blades: 6,
          bladeWidth: 1.5,
          bladeHeight: 4,
          bladeRadius: 0.75,
          output: 12,
        },
      },
    },
  },

  defaultVariants: { variant: "primary", size: "medium" },
});

export type SpinnerVariant = keyof typeof spinnerRecipe.variants.variant;
export type SpinnerSize = keyof typeof spinnerRecipe.variants.size;

export interface SpinnerGeometry {
  bladeHeight: number;
  bladeRadius: number;
  blades: number;
  bladeWidth: number;
  output: number;
}

export function getSpinnerGeometry(size: SpinnerSize): SpinnerGeometry {
  return spinnerRecipe.variants.size[size].root as unknown as SpinnerGeometry;
}
