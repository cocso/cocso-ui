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

const BLADES = Array.from({ length: 12 }, (_, i) => ({
  rotation: i * 30,
  delay: (11 - i) / 12,
}));

type BladeConfig = {
  container: number;
  height: number;
  left: number;
  originY: number;
  radius: number;
  width: number;
};

const sizeConfig: Record<SpinnerSize, BladeConfig> = {
  small: { container: 16, left: 7, width: 1.5, height: 5, radius: 1, originY: -4 },
  medium: { container: 24, left: 11, width: 2, height: 7, radius: 2, originY: -6 },
  large: { container: 32, left: 15, width: 2.5, height: 9, radius: 2, originY: -8 },
  "x-large": { container: 40, left: 19, width: 3, height: 11, radius: 3, originY: -10 },
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
  const config = sizeConfig[size];
  const bladeColor = getBladeColor(color);

  return (
    <output
      aria-label={label}
      aria-live="polite"
      className={cn(styles.spinner, className)}
      ref={ref}
      style={{
        width: `${config.container}px`,
        height: `${config.container}px`,
        ..._style,
      }}
      {...props}
    >
      {BLADES.map(({ rotation, delay }) => (
        <div
          className={styles.blade}
          key={rotation}
          style={{
            left: `${config.left}px`,
            width: `${config.width}px`,
            height: `${config.height}px`,
            borderRadius: `${config.radius}px`,
            backgroundColor: bladeColor,
            transformOrigin: `center ${config.originY}px`,
            animationDelay: `${-delay}s`,
            transform: `rotate(${rotation}deg)`,
          } as CSSProperties}
        />
      ))}
    </output>
  );
}
