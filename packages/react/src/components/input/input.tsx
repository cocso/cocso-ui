import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import { radius } from "../../token";
import { Field } from "../field";
import styles from "./input.module.css";
export type InputSize = "large" | "medium" | "small" | "x-small";
export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  description?: string;
  disabled?: boolean;
  error?: boolean | string;
  label?: string;
  size?: InputSize;
  stretch?: boolean;
}
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
