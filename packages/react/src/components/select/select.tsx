import { SelectorIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import { radius } from "../../token";
import { Field, useField } from "../field";
import styles from "./select.module.css";

export type SelectSize = "large" | "medium" | "small" | "x-small";

export interface SelectProps extends Omit<ComponentProps<"select">, "size"> {
  description?: string;
  disabled?: boolean;
  error?: boolean | string;
  label?: string;
  size?: SelectSize;
  stretch?: boolean;
}

export function Select({
  ref,
  className,
  style: _style,
  size = "medium",
  disabled = false,
  error = false,
  stretch = false,
  label,
  description,
  id: _id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;
  const field = useField();
  const describedBy = field.errorId ?? field.descriptionId;

  const wrapperStyle = { ...getStyles(size) } as CSSProperties;

  const select = (
    <div
      className={cn(
        styles.wrapper,
        stretch && styles.stretch,
        hasError && styles.error,
        className
      )}
      style={wrapperStyle}
    >
      <select
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={styles.select}
        disabled={disabled}
        id={id}
        ref={ref}
        style={_style}
        {...props}
      >
        {children}
      </select>

      <span className={styles.icon}>
        <SelectorIcon size={getIconSize(size)} />
      </span>
    </div>
  );

  if (label) {
    return (
      <Field
        description={description}
        error={errorMessage}
        htmlFor={id}
        label={label}
        required={props.required}
      >
        {select}
      </Field>
    );
  }

  return select;
}

const getIconSize = (size: SelectSize) =>
  match(size)
    .with("x-small", () => 10)
    .with("small", () => 12)
    .with("medium", () => 14)
    .with("large", () => 14)
    .exhaustive();

const getStyles = (size: SelectSize) =>
  match(size)
    .with("x-small", () => ({
      "--cocso-select-min-width": "28px",
      "--cocso-select-height": "28px",
      "--cocso-select-padding-left": "8px",
      "--cocso-select-padding-right": "26px",
      "--cocso-select-icon-right": "8px",
      "--cocso-select-font-size": "12px",
      "--cocso-select-border-radius": radius.r3,
    }))
    .with("small", () => ({
      "--cocso-select-min-width": "32px",
      "--cocso-select-height": "32px",
      "--cocso-select-padding-left": "10px",
      "--cocso-select-padding-right": "32px",
      "--cocso-select-icon-right": "10px",
      "--cocso-select-font-size": "12px",
      "--cocso-select-border-radius": radius.r3,
    }))
    .with("medium", () => ({
      "--cocso-select-min-width": "36px",
      "--cocso-select-height": "36px",
      "--cocso-select-padding-left": "12px",
      "--cocso-select-padding-right": "38px",
      "--cocso-select-icon-right": "12px",
      "--cocso-select-font-size": "14px",
      "--cocso-select-border-radius": radius.r4,
    }))
    .with("large", () => ({
      "--cocso-select-min-width": "40px",
      "--cocso-select-height": "40px",
      "--cocso-select-padding-left": "14px",
      "--cocso-select-padding-right": "42px",
      "--cocso-select-icon-right": "14px",
      "--cocso-select-font-size": "14px",
      "--cocso-select-border-radius": radius.r4,
    }))
    .exhaustive();
