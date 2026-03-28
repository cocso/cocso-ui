import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { resolveStyleMap } from "@cocso-ui/recipe/resolvers/react-styles";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import styles from "./spinner.module.css";

export type SpinnerSize = keyof typeof spinnerRecipe.variants.size;
export type SpinnerVariant = keyof typeof spinnerRecipe.variants.variant;

export interface SpinnerProps extends Omit<ComponentProps<"output">, "size"> {
  label?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

/** Loading indicator rendered as an accessible output element. */
export function Spinner({
  ref,
  className,
  style: _style,
  size = "medium",
  variant = "primary",
  label = "Loading",
  ...props
}: SpinnerProps) {
  const sizeData = spinnerRecipe.variants.size[size].root as unknown as {
    blades: number;
    bladeWidth: number;
    bladeHeight: number;
    bladeRadius: number;
    output: number;
  };
  const resolved = resolveStyleMap(spinnerRecipe, { variant, size });
  const bladeCount = sizeData.blades;
  const width = sizeData.bladeWidth;
  const height = sizeData.bladeHeight;
  const radius = sizeData.bladeRadius;
  const output = sizeData.output;
  const bladeColor = resolved["--cocso-spinner-blade-color"];
  const container = output;
  const left = (container - width) / 2;
  const originY = height - container / 2;

  const step = 360 / bladeCount;
  const blades = Array.from({ length: bladeCount }, (_, i) => ({
    angle: i * step,
    delay: -((bladeCount - 1 - i) * (0.75 / bladeCount)),
  }));

  return (
    <output
      aria-label={label}
      aria-live="polite"
      className={cn(styles.spinner, className)}
      ref={ref}
      style={{
        width: `${container}px`,
        height: `${container}px`,
        color: bladeColor,
        ..._style,
      }}
      {...props}
    >
      {blades.map(({ angle, delay }) => (
        <div
          className={styles.blade}
          key={`blade-${angle}`}
          style={
            {
              left: `${left}px`,
              width: `${width}px`,
              height: `${height}px`,
              borderRadius: `${radius}px`,
              backgroundColor: "currentColor",
              transformOrigin: `center ${originY}px`,
              animationDelay: `${delay}s`,
              transform: `rotate(${angle}deg)`,
            } as CSSProperties
          }
        />
      ))}
    </output>
  );
}
