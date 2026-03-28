import { defineRecipe } from "../define-recipe";

export const spinnerRecipe = defineRecipe({
  name: "spinner",
  slots: ["root"] as const,

  variants: {
    variant: {
      primary: { root: { bladeColor: "primary-950" } },
      secondary: { root: { bladeColor: "neutral-500" } },
      success: { root: { bladeColor: "success-500" } },
      error: { root: { bladeColor: "danger-500" } },
      warning: { root: { bladeColor: "warning-500" } },
      info: { root: { bladeColor: "info-500" } },
      white: { root: { bladeColor: "white" } },
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
