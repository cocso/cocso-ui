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
      white: { root: { bladeColor: "surface-primary" } },
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
