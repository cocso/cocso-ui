import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { cn } from "../../cn";
import { Field, useField } from "../field";
import { getStyles } from "./input.styles";
import styles from "./input.module.css";

export type { InputSize } from "./input.styles";
import type { InputSize } from "./input.styles";

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

  const inputEl = (
    <FieldAwareInput
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
        {inputEl}
      </Field>
    );
  }

  return inputEl;
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
