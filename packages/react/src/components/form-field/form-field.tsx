import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./form-field.module.css";
import { type FormFieldProps, FormFieldScope } from "./form-field-context";
import {
  FormFieldInput,
  FormFieldInputTrigger,
  FormFieldLabel,
} from "./form-field-parts";

export type {
  FormFieldContextValue,
  FormFieldProps,
} from "./form-field-context";
export { useFormField } from "./form-field-context";
export type {
  FormFieldInputProps,
  FormFieldInputTriggerProps,
  FormFieldLabelProps,
} from "./form-field-parts";

function FormFieldRoot(props: FormFieldProps) {
  return <FormFieldScope {...props} />;
}

/**
 * A value that cannot be edited, shown where the input would be — same
 * height and same inset as the inputs around it, so read-only and editable
 * rows start their text on one line.
 */
function FormFieldValue({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(styles.value, className)}
      data-cocso-component="form-field-value"
      {...props}
    />
  );
}

/**
 * A label beside its control, on one line — the layout of an admin form.
 *
 * `Field` stacks a label over its control with a description and an error
 * under it; this lays them side by side with a fixed label column, so every
 * row of a long form starts its control at the same place. Below 768px the
 * label moves above the control.
 *
 * The label is tied to the control: the root makes an id, `FormField.Label`
 * points at it and `FormField.Input` / `FormField.InputTrigger` carry it. Any
 * other control takes it from `useFormField()`.
 *
 * The compound object lives in a module without `"use client"` so a Server
 * Component can reach `FormField.Label`; the parts that need hooks are
 * client modules of their own.
 *
 * @example
 * <FormField>
 *   <FormField.Label required width={120}>Email</FormField.Label>
 *   <FormField.Input required type="email" />
 * </FormField>
 */
export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Input: FormFieldInput,
  InputTrigger: FormFieldInputTrigger,
  Value: FormFieldValue,
});
