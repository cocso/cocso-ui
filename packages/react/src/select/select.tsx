import { KeyboardArrowDownIcon } from "@cocso-ui/react-icons";
import { clsx as cx } from "clsx";
import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { spacing } from "../token";
import styles from "./select.module.css";

type SelectSize =
  | "x-large"
  | "large"
  | "medium"
  | "small"
  | "x-small"
  | "2x-small";

export interface SelectProps
  extends Omit<ComponentProps<"select">, "size"> {
  disabled?: boolean;
  size?: SelectSize;
  stretch?: boolean;
}

export function Select({
  ref,
  className,
  style: _style,
  size = "medium",
  disabled = false,
  stretch = false,
  children,
  ...props
}: SelectProps) {
  const style = {
    ..._style,
    ...getStyles(size),
  } as CSSProperties;

  return (
    <div
      className={cx(
        styles.wrapper,
        stretch && styles.stretch,
        disabled && styles.disabled,
        className
      )}
    >
      <select
        className={styles.select}
        disabled={disabled}
        ref={ref}
        style={style}
        {...props}
      >
        {children}
      </select>

      <span className={styles.icon}>
        <KeyboardArrowDownIcon size={20} />
      </span>
    </div>
  );
}

const getStyles = (size: SelectSize) =>
  match(size)
    .with("2x-small", () => ({
      "--cocso-select-min-width": spacing.s11,
      "--cocso-select-height": spacing.s11,
      "--cocso-select-padding-left": spacing.s5,
      "--cocso-select-padding-right": `calc(${spacing.s8} + 16px)`,
      "--cocso-select-font-size": "12px",
      "--cocso-select-border-radius": spacing.s3,
    }))
    .with("x-small", () => ({
      "--cocso-select-min-width": spacing.s12,
      "--cocso-select-height": spacing.s12,
      "--cocso-select-padding-left": spacing.s6,
      "--cocso-select-padding-right": `calc(${spacing.s7} + 16px)`,
      "--cocso-select-font-size": "14px",
      "--cocso-select-border-radius": spacing.s3,
    }))
    .with("small", () => ({
      "--cocso-select-min-width": spacing.s14,
      "--cocso-select-height": spacing.s14,
      "--cocso-select-padding-left": spacing.s7,
      "--cocso-select-padding-right": `calc(${spacing.s7} + 16px)`,
      "--cocso-select-font-size": "14px",
      "--cocso-select-border-radius": spacing.s3,
    }))
    .with("medium", () => ({
      "--cocso-select-min-width": spacing.s16,
      "--cocso-select-height": spacing.s16,
      "--cocso-select-padding-left": spacing.s8,
      "--cocso-select-padding-right": `calc(${spacing.s8} + 16px)`,
      "--cocso-select-font-size": "16px",
      "--cocso-select-border-radius": spacing.s4,
    }))
    .with("large", () => ({
      "--cocso-select-min-width": spacing.s17,
      "--cocso-select-height": spacing.s17,
      "--cocso-select-padding-left": spacing.s9,
      "--cocso-select-padding-right": `calc(${spacing.s9} + 16px)`,
      "--cocso-select-font-size": "18px",
      "--cocso-select-border-radius": spacing.s4,
    }))
    .with("x-large", () => ({
      "--cocso-select-min-width": spacing.s18,
      "--cocso-select-height": spacing.s18,
      "--cocso-select-padding-left": spacing.s10,
      "--cocso-select-padding-right": `calc(${spacing.s10} + 16px)`,
      "--cocso-select-font-size": "18px",
      "--cocso-select-border-radius": spacing.s4,
    }))
    .exhaustive();
