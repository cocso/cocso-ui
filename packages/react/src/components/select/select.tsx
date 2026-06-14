"use client";

import { select as selectClass } from "@cocso-ui/codegen/generated/select";
import { SelectorIcon } from "@cocso-ui/react-icons";
import "@cocso-ui/codegen/generated/select.css";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { cn } from "../../cn";
import { Field, useField } from "../field";
import styles from "./select.module.css";

export type SelectSize = "large" | "medium" | "small" | "x-small";

const ICON_SIZES: Record<SelectSize, number> = {
  "x-small": 10,
  small: 12,
  medium: 14,
  large: 14,
};

export interface SelectProps extends Omit<ComponentProps<"select">, "size"> {
  description?: string;
  disabled?: boolean;
  error?: boolean | string;
  label?: string;
  size?: SelectSize;
  stretch?: boolean;
}

/** Dropdown select component wrapping native select. */
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

  const wrapperStyle = {} as CSSProperties;

  const select = (
    <div
      className={cn(
        selectClass({ size }),
        styles.wrapper,
        stretch && styles.stretch,
        hasError && styles.error,
        className
      )}
      style={wrapperStyle}
    >
      <FieldAwareSelect
        aria-invalid={hasError || undefined}
        className={styles.select}
        disabled={disabled}
        id={id}
        ref={ref}
        style={_style}
        {...props}
      >
        {children}
      </FieldAwareSelect>

      <span className={styles.icon}>
        <SelectorIcon size={ICON_SIZES[size]} />
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

function FieldAwareSelect({
  "aria-describedby": callerDescribedBy,
  ...props
}: ComponentProps<"select">) {
  const field = useField();
  const fieldDescribedBy = field.errorId ?? field.descriptionId;
  const describedBy =
    [fieldDescribedBy, callerDescribedBy].filter(Boolean).join(" ") ||
    undefined;
  return <select aria-describedby={describedBy} {...props} />;
}
