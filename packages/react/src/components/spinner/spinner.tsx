import { spinner } from "@cocso-ui/codegen/generated/spinner";
import { getSpinnerGeometry } from "@cocso-ui/codegen/generated/spinner-geometry";
import "@cocso-ui/codegen/generated/spinner.css";

export type { SpinnerVariant } from "@cocso-ui/codegen/generated/spinner";
export type { SpinnerSize } from "@cocso-ui/codegen/generated/spinner-geometry";

import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import styles from "./spinner.module.css";

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
  const {
    blades: bladeCount,
    bladeWidth: width,
    bladeHeight: height,
    bladeRadius: radius,
    output,
  } = getSpinnerGeometry(size);
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
      className={cn(spinner({ variant, size }), styles.spinner, className)}
      ref={ref}
      style={{
        width: `${container}px`,
        height: `${container}px`,
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
