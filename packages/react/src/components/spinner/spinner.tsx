import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import styles from "./spinner.module.css";

export type { SpinnerSize, SpinnerVariant } from "./spinner.styles";

import {
  getBladeColor,
  getSizeConfig,
  type SpinnerSize,
  type SpinnerVariant,
} from "./spinner.styles";

export interface SpinnerProps extends Omit<ComponentProps<"output">, "size"> {
  label?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

export function Spinner({
  ref,
  className,
  style: _style,
  size = "medium",
  variant = "primary",
  label = "Loading",
  ...props
}: SpinnerProps) {
  const {
    output,
    blades: bladeCount,
    width,
    height,
    radius,
  } = getSizeConfig(size);
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
        color: getBladeColor(variant),
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
