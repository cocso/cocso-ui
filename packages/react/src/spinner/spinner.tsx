import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import { colors } from "../token";
import styles from "./spinner.module.css";

export type SpinnerSize = "x-large" | "large" | "medium" | "small";

export type SpinnerColor = "primary" | "neutral" | "white";

export interface SpinnerProps
  extends Omit<ComponentProps<"output">, "size" | "color"> {
  color?: SpinnerColor;
  label?: string;
  size?: SpinnerSize;
}

type SizeConfig = {
  container: number;
  bladeCount: number;
  blade: { width: number; height: number; radius: number };
};

const sizeConfig: Record<SpinnerSize, SizeConfig> = {
  small: { container: 16, bladeCount: 8, blade: { width: 1.5, height: 4.5, radius: 1 } },
  medium: { container: 24, bladeCount: 10, blade: { width: 2, height: 6, radius: 1 } },
  large: { container: 32, bladeCount: 12, blade: { width: 2.5, height: 8, radius: 2 } },
  "x-large": { container: 40, bladeCount: 12, blade: { width: 3, height: 10, radius: 2 } },
};

const getBladeColor = (color: SpinnerColor) =>
  match(color)
    .with("primary", () => colors.primary500)
    .with("neutral", () => colors.neutral600)
    .with("white", () => colors.white)
    .exhaustive();

export function Spinner({
  ref,
  className,
  style: _style,
  size = "medium",
  color = "primary",
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
        color: getBladeColor(color),
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
