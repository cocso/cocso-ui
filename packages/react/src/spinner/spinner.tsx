import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import { colors } from "../token";
import styles from "./spinner.module.css";

export type SpinnerSize = "large" | "medium" | "small";

export type SpinnerVariant = "primary" | "secondary" | "success" | "error" | "warning" | "white";

export interface SpinnerProps
  extends Omit<ComponentProps<"output">, "size"> {
  label?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

type SizeConfig = {
  container: number;
  bladeCount: number;
  blade: { width: number; height: number; radius: number };
};

const sizeConfig: Record<SpinnerSize, SizeConfig> = {
  small: { container: 12, bladeCount: 8, blade: { width: 1.5, height: 4, radius: 0.75 } },
  medium: { container: 16, bladeCount: 10, blade: { width: 2, height: 5, radius: 1 } },
  large: { container: 20, bladeCount: 12, blade: { width: 2, height: 6.5, radius: 1 } },
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
      {Array.from({ length: bladeCount }, (_, i) => (
        <div
          className={styles.blade}
          key={i}
          style={{
            left: `${left}px`,
            width: `${blade.width}px`,
            height: `${blade.height}px`,
            borderRadius: `${blade.radius}px`,
            backgroundColor: "currentColor",
            transformOrigin: `center ${originY}px`,
            animationDelay: `${-((bladeCount - 1 - i) * (0.75 / bladeCount))}s`,
            transform: `rotate(${i * (360 / bladeCount)}deg)`,
          } as CSSProperties}
        />
      ))}
    </output>
  );
}
