import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import { radius, spacing } from "../token";
import styles from "./input.module.css";

export type InputSize = "large" | "medium" | "small";

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  disabled?: boolean;
  size?: InputSize;
  stretch?: boolean;
}

export function Input({
  ref,
  className,
  style: _style,
  size = "medium",
  disabled = false,
  stretch = false,
  ...props
}: InputProps) {
  const style = {
    ..._style,
    ...getStyles(size),
  } as CSSProperties;

  return (
    <input
      className={cn(
        styles.input,
        stretch && styles.stretch,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      ref={ref}
      style={style}
      {...props}
    />
  );
}

const getStyles = (size: InputSize) =>
  match(size)
    .with("small", () => ({
      "--cocso-input-height": spacing.s11,
      "--cocso-input-padding-x": spacing.s5,
      "--cocso-input-font-size": "12px",
      "--cocso-input-border-radius": radius.r3,
    }))
    .with("medium", () => ({
      "--cocso-input-height": spacing.s12,
      "--cocso-input-padding-x": spacing.s6,
      "--cocso-input-font-size": "14px",
      "--cocso-input-border-radius": radius.r4,
    }))
    .with("large", () => ({
      "--cocso-input-height": spacing.s14,
      "--cocso-input-padding-x": spacing.s7,
      "--cocso-input-font-size": "14px",
      "--cocso-input-border-radius": radius.r4,
    }))
    .exhaustive();
