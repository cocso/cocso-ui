"use client";

import { input } from "@cocso-ui/codegen/generated/input";
import "@cocso-ui/codegen/generated/input.css";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import type { InputSize } from "../input";
import styles from "./input-trigger.module.css";

export interface InputTriggerProps
  extends Omit<ComponentProps<"button">, "prefix"> {
  error?: boolean | string;
  /** Shown in a muted style when no `children` value is present. */
  placeholder?: string;
  /** Leading content (e.g. an icon) rendered before the value. */
  prefix?: ReactNode;
  size?: InputSize;
  stretch?: boolean;
  /** Trailing content (e.g. a calendar or chevron icon). */
  suffix?: ReactNode;
}

/**
 * A native `<button>` styled to look like an `Input`. Use it as the trigger for
 * `Dropdown`, `DayPicker`, `MonthPicker`, etc. — being a real button, it never
 * triggers Base UI's `nativeButton` warning, while still presenting an
 * input-like surface (value/placeholder + optional affix icons).
 */
export function InputTrigger({
  ref,
  className,
  size = "medium",
  error = false,
  stretch = false,
  disabled = false,
  prefix,
  suffix,
  placeholder,
  children,
  ...props
}: InputTriggerProps) {
  const hasError = !!error;
  const hasValue = children != null && children !== "";

  return (
    <button
      aria-invalid={hasError || undefined}
      className={cn(
        input({ size }),
        styles.trigger,
        stretch && styles.stretch,
        hasError && styles.error,
        className
      )}
      data-cocso-component="input-trigger"
      disabled={disabled}
      ref={ref}
      type="button"
      {...props}
    >
      {prefix && <span className={styles.affix}>{prefix}</span>}
      <span className={cn(styles.value, !hasValue && styles.placeholder)}>
        {hasValue ? children : placeholder}
      </span>
      {suffix && <span className={styles.affix}>{suffix}</span>}
    </button>
  );
}
