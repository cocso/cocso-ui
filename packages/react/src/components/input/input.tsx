"use client";

import { input } from "@cocso-ui/codegen/generated/input";
import "@cocso-ui/codegen/generated/input.css";
import { EyeIcon, EyeOffIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { useId, useState } from "react";
import { cn } from "../../cn";
import { Field, useField } from "../field";
import styles from "./input.module.css";

export type InputSize = "large" | "medium" | "small" | "x-small";

const ICON_SIZES: Record<InputSize, number> = {
  "x-small": 12,
  small: 14,
  medium: 16,
  large: 16,
};

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  description?: string;
  disabled?: boolean;
  error?: boolean | string;
  label?: string;
  /**
   * Renders a button that reveals the value. Opt-in rather than inferred from
   * `type="password"`, so an existing password field does not grow a button on
   * upgrade.
   */
  passwordToggle?: boolean;
  size?: InputSize;
  stretch?: boolean;
}

/** Text input component with size and variant options. */
export function Input({
  ref,
  className,
  style: _style,
  size = "medium",
  disabled = false,
  error = false,
  stretch = false,
  passwordToggle = false,
  label,
  description,
  id: _id,
  type,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;
  const [revealed, setRevealed] = useState(false);

  // The `type` attribute is toggled, not an inline style: browsers key password
  // save and autofill off `autocomplete`, so switching between `password` and
  // `text` leaves them alone.
  const resolvedType = passwordToggle && revealed ? "text" : type;

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  const style = {
    ..._style,
  } as CSSProperties;

  const inputEl = (
    <FieldAwareInput
      aria-invalid={hasError || undefined}
      className={cn(
        input({ size }),
        styles.input,
        stretch && styles.stretch,
        hasError && styles.error,
        passwordToggle && styles.withToggle,
        className
      )}
      data-cocso-component="input"
      disabled={disabled}
      id={id}
      ref={ref}
      style={style}
      type={resolvedType}
      {...props}
    />
  );

  // Only wrapped when the toggle is on. The button needs a positioned ancestor,
  // but a wrapper around every Input would move the caller's `className` off
  // the field and onto a shell it did not ask for.
  const control = passwordToggle ? (
    <span
      className={cn(styles.control, stretch && styles.stretch)}
      data-cocso-component="input-control"
    >
      {inputEl}
      <button
        aria-label={revealed ? "Hide password" : "Show password"}
        aria-pressed={revealed}
        className={styles.toggle}
        disabled={disabled}
        onClick={() => setRevealed((shown) => !shown)}
        tabIndex={disabled ? -1 : undefined}
        type="button"
      >
        {revealed ? (
          <EyeOffIcon size={ICON_SIZES[size]} />
        ) : (
          <EyeIcon size={ICON_SIZES[size]} />
        )}
      </button>
    </span>
  ) : (
    inputEl
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
        {control}
      </Field>
    );
  }

  return control;
}

function FieldAwareInput({
  "aria-describedby": callerDescribedBy,
  ...props
}: ComponentProps<"input">) {
  const field = useField();
  const fieldDescribedBy = field.errorId ?? field.descriptionId;
  const describedBy =
    [fieldDescribedBy, callerDescribedBy].filter(Boolean).join(" ") ||
    undefined;
  return <input aria-describedby={describedBy} {...props} />;
}
