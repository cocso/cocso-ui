"use client";

import { input } from "@cocso-ui/codegen/generated/input";
import "@cocso-ui/codegen/generated/input.css";
import { type ComponentProps, createContext, useContext, useId } from "react";
import { cn } from "../../cn";
import type { InputSize } from "../input";
import styles from "./form-field.module.css";

export interface FormFieldContextValue {
  /** The id the row's control should carry. `FormField.Label` points at it. */
  controlId: string;
  /** The id `FormField.Label` carries, for controls named by `aria-labelledby`. */
  labelId: string;
  /** The input size the row is laid out for. */
  size: InputSize;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * The ids and size of the enclosing `FormField`.
 *
 * `FormField.Input` and `FormField.InputTrigger` read this themselves. Any
 * other control placed in the row — a `Select`, a picker trigger, a search
 * box — should take `id={controlId}` so the row's label names it. Returns
 * `null` outside a `FormField`.
 */
export const useFormField = () => useContext(FormFieldContext);

export interface FormFieldProps extends ComponentProps<"div"> {
  /**
   * The input size the row lines up with. The label's height and
   * `FormField.Value`'s inset follow it, and `FormField.Input` /
   * `FormField.InputTrigger` default to it.
   */
  size?: InputSize;
}

/**
 * The client half of the `FormField` root: it owns the ids, so it is the part
 * that needs hooks. Kept apart from `form-field.tsx` so the compound object
 * itself stays importable from a React Server Component.
 */
export function FormFieldScope({
  className,
  size = "small",
  children,
  ...props
}: FormFieldProps) {
  const controlId = useId();
  const labelId = useId();

  return (
    <FormFieldContext.Provider value={{ controlId, labelId, size }}>
      <div
        className={cn(input({ size }), styles.root, className)}
        data-cocso-component="form-field"
        {...props}
      >
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}
