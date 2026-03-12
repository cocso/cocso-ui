import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import { Field } from "../field";
import { radius } from "../token";
import styles from "./input.module.css";

/** Size variant of the {@link Input} component. */
export type InputSize = "large" | "medium" | "small" | "x-small";

/** Props for the {@link Input} component. */
export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  /** Helper text rendered below the input via a {@link Field} wrapper. Only used when `label` is set. */
  description?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Error state. Pass `true` to style the input as invalid, or a string to also show an error message. */
  error?: boolean | string;
  /** When provided, the input is wrapped in a {@link Field} component with this label. */
  label?: string;
  /** The size variant controlling height, padding, font size, and border radius. */
  size?: InputSize;
  /** When `true`, the input expands to fill its container width. */
  stretch?: boolean;
}

/** A text input field. When `label` is provided, it is wrapped in a {@link Field} with label, description, and error support. */
export function Input({
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
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  const style = {
    ..._style,
    ...getStyles(size),
  } as CSSProperties;

  const input = (
    <input
      aria-invalid={hasError || undefined}
      className={cn(
        styles.input,
        stretch && styles.stretch,
        hasError && styles.error,
        className
      )}
      disabled={disabled}
      id={id}
      ref={ref}
      style={style}
      {...props}
    />
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
        {input}
      </Field>
    );
  }

  return input;
}

const getStyles = (size: InputSize) =>
  match(size)
    .with("x-small", () => ({
      "--cocso-input-height": "28px",
      "--cocso-input-padding-x": "8px",
      "--cocso-input-font-size": "12px",
      "--cocso-input-border-radius": radius.r3,
    }))
    .with("small", () => ({
      "--cocso-input-height": "32px",
      "--cocso-input-padding-x": "10px",
      "--cocso-input-font-size": "12px",
      "--cocso-input-border-radius": radius.r3,
    }))
    .with("medium", () => ({
      "--cocso-input-height": "36px",
      "--cocso-input-padding-x": "12px",
      "--cocso-input-font-size": "14px",
      "--cocso-input-border-radius": radius.r4,
    }))
    .with("large", () => ({
      "--cocso-input-height": "40px",
      "--cocso-input-padding-x": "14px",
      "--cocso-input-font-size": "14px",
      "--cocso-input-border-radius": radius.r4,
    }))
    .exhaustive();
