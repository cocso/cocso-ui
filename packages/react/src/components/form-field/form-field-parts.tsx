"use client";

import { type ComponentProps, type CSSProperties, useId } from "react";
import { cn } from "../../cn";
import { Input, type InputProps } from "../input";
import { InputTrigger, type InputTriggerProps } from "../input-trigger";
import styles from "./form-field.module.css";
import { useFormField } from "./form-field-context";

export interface FormFieldLabelProps extends ComponentProps<"label"> {
  /**
   * Appends a required marker. It is decoration only — mark the control itself
   * `required` so assistive technology announces it.
   */
  required?: boolean;
  /**
   * Fixed width of the label column, so labels in one form line up. A number
   * is pixels. Defaults to `--cocso-form-field-label-width`, then 128px, so a
   * form can set the variable once instead of passing this on every row.
   */
  width?: string | number;
}

export function FormFieldLabel({
  className,
  style: _style,
  required,
  width,
  htmlFor,
  id,
  children,
  ...props
}: FormFieldLabelProps) {
  const field = useFormField();
  const style = {
    ..._style,
    ...(width === undefined
      ? {}
      : {
          "--cocso-form-field-label-width":
            typeof width === "number" ? `${width}px` : width,
        }),
  } as CSSProperties;

  return (
    <label
      className={cn(styles.label, className)}
      data-cocso-component="form-field-label"
      htmlFor={htmlFor ?? field?.controlId}
      id={id ?? field?.labelId}
      style={style}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className={styles.required}>
          *
        </span>
      )}
    </label>
  );
}

export type FormFieldInputProps = InputProps;

/**
 * The row's text input: an `Input` at the row's size, stretched to the space
 * beside the label, carrying the id the label points at.
 *
 * `type="password"` turns the reveal button on by default. `Input` keeps it
 * opt-in so an existing field does not change on upgrade; a `FormField` row
 * has no such history, and a password typed blind is only checked by
 * submitting it. Pass `passwordToggle={false}` to opt out.
 *
 * Every `FormField.Input` in a row defaults to the row's one id. A row holding
 * two inputs (a range, say) must give the second its own `id` — and an
 * `aria-label` — or the page carries a duplicate id.
 */
export function FormFieldInput({
  id,
  size,
  type,
  passwordToggle,
  stretch = true,
  ...props
}: FormFieldInputProps) {
  const field = useFormField();
  return (
    <Input
      id={id ?? field?.controlId}
      passwordToggle={passwordToggle ?? type === "password"}
      size={size ?? field?.size ?? "small"}
      stretch={stretch}
      type={type}
      {...props}
    />
  );
}

export interface FormFieldInputTriggerProps
  extends Omit<InputTriggerProps, "value"> {
  /** The current value as text. `children`, when given, wins over it. */
  value?: string;
}

/**
 * An `InputTrigger` at the row's size — the button a picker or a popover
 * opens from, looking like the inputs around it.
 *
 * Named by the row's label and its own text together (`aria-labelledby`
 * pointing at both). A `<label for>` would replace the button's name and the
 * chosen value would never be announced, so the trigger deliberately carries
 * an id of its own rather than the one the label points at — with both, the
 * self-reference resolves to the label a second time instead of the value.
 */
export function FormFieldInputTrigger({
  id,
  size,
  value,
  children,
  stretch = true,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: FormFieldInputTriggerProps) {
  const field = useFormField();
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const labelledBy =
    ariaLabelledBy ?? (field ? `${field.labelId} ${triggerId}` : undefined);

  return (
    <InputTrigger
      aria-labelledby={labelledBy}
      id={triggerId}
      size={size ?? field?.size ?? "small"}
      stretch={stretch}
      {...props}
    >
      {children ?? value}
    </InputTrigger>
  );
}
