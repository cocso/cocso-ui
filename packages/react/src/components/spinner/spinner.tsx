import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import { colors } from "../../token";
import styles from "./spinner.module.css";

/** Available size variants for the Spinner component. */
export type SpinnerSize = "large" | "medium" | "small";

/** Available color variants for the Spinner component. */
export type SpinnerVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "white";

/** Props for the Spinner component. */
export interface SpinnerProps extends Omit<ComponentProps<"output">, "size"> {
  /** Accessible label announced to screen readers (defaults to "Loading"). */
  label?: string;
  /** Visual size of the spinner. */
  size?: SpinnerSize;
  /** Color variant of the spinner blades. */
  variant?: SpinnerVariant;
}

interface SizeConfig {
  blade: { width: number; height: number; radius: number };
  bladeCount: number;
  container: number;
}

const sizeConfig: Record<SpinnerSize, SizeConfig> = {
  small: {
    container: 12,
    bladeCount: 6,
    blade: { width: 1.5, height: 4, radius: 0.75 },
  },
  medium: {
    container: 16,
    bladeCount: 8,
    blade: { width: 2, height: 5, radius: 1 },
  },
  large: {
    container: 20,
    bladeCount: 10,
    blade: { width: 2, height: 6, radius: 1 },
  },
};

const getVariantColor = (variant: SpinnerVariant) =>
  match(variant)
    .with("primary", () => colors.primary500)
    .with("secondary", () => colors.neutral500)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning500)
    .with("white", () => colors.white)
    .exhaustive();

/**
 * A loading spinner rendered as rotating blades with configurable size and color variant.
 */
export function Spinner({
  ref,
  className,
  style: _style,
  size = "medium",
  variant = "primary",
  label = "Loading",
  ...props
}: SpinnerProps) {
  const { container, bladeCount, blade } = sizeConfig[size];
  const left = (container - blade.width) / 2;
  const originY = blade.height - container / 2;

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
        color: getVariantColor(variant),
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
              width: `${blade.width}px`,
              height: `${blade.height}px`,
              borderRadius: `${blade.radius}px`,
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
