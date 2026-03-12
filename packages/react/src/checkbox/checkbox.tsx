import { Checkbox as CheckboxBase } from "@base-ui/react/checkbox";
import { CheckIcon, CheckIndeterminateSmallIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import { colors, spacing } from "../token";
import { Typography } from "../typography";
import styles from "./checkbox.module.css";

/** Available checkbox size options. */
export type CheckboxSize = "large" | "medium" | "small";

/** Represents the checked state of a checkbox, including the indeterminate state. */
export type CheckboxStatus = "on" | "off" | "intermediate";

/** Props for the {@link Checkbox} component. */
export interface CheckboxProps
  extends Omit<
    ComponentProps<typeof CheckboxBase.Root>,
    "checked" | "onCheckedChange" | "onChange" | "indeterminate"
  > {
  /** Whether the checkbox is disabled. */
  disabled?: boolean;
  /** The `id` attribute for the underlying input element. Auto-generated if omitted. */
  id?: string;
  /** Optional label text rendered beside the checkbox. */
  label?: string;
  /** Callback fired when the checked state changes. */
  onChange: (status: CheckboxStatus) => void;
  /** Size of the checkbox. Defaults to `"medium"`. */
  size?: CheckboxSize;
  /** The current checked state of the checkbox. */
  status: CheckboxStatus;
}

/**
 * A controlled checkbox component supporting checked, unchecked, and indeterminate states.
 * Renders an optional label and manages its own `id` when one is not provided.
 *
 * @param props - {@link CheckboxProps}
 */
export function Checkbox({
  ref,
  id: _id,
  className,
  style: _style,
  size = "medium",
  status,
  onChange,
  label,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const handleCheckedChange = (checked: boolean) => {
    if (!disabled) {
      const nextStatus = checked ? ("on" as const) : ("off" as const);
      onChange(nextStatus);
    }
  };

  const style = {
    ..._style,
    "--cocso-checkbox-size": getSize(size),
    "--cocso-checkbox-radius": getRadius(size),
    "--cocso-checkbox-color": colors.white,
    "--cocso-checkbox-border-color": getBorderColor(status),
    "--cocso-checkbox-bg-color": getBackgroundColor(status),
  } as CSSProperties;

  const checkedState = getCheckedState(status);

  return (
    <div className={cn(styles.wrapper, className)} style={style}>
      <CheckboxBase.Root
        checked={checkedState.checked}
        className={styles.checkbox}
        disabled={disabled}
        id={id}
        indeterminate={checkedState.indeterminate}
        onCheckedChange={handleCheckedChange}
        ref={ref}
        {...props}
      >
        <CheckboxBase.Indicator
          className={styles.indicator}
          style={{ opacity: status === "on" ? 1 : 0 }}
        >
          <CheckIcon className={styles.icon} size={24} />
        </CheckboxBase.Indicator>

        <div
          aria-hidden="true"
          className={styles.indicator}
          style={{ opacity: status === "intermediate" ? 1 : 0 }}
        >
          <CheckIndeterminateSmallIcon className={styles.icon} size={24} />
        </div>
      </CheckboxBase.Root>

      {label && (
        <Typography
          aria-disabled={disabled}
          className={styles.label}
          render={<label htmlFor={id}>{label}</label>}
          size={size}
          type="body"
        />
      )}
    </div>
  );
}

const getCheckedState = (
  status: CheckboxStatus
): { checked: boolean; indeterminate: boolean } =>
  match(status)
    .with("on", () => ({ checked: true, indeterminate: false }))
    .with("intermediate", () => ({ checked: false, indeterminate: true }))
    .with("off", () => ({ checked: false, indeterminate: false }))
    .exhaustive();

const getSize = (size: CheckboxSize) =>
  match(size)
    .with("large", () => spacing.s9)
    .with("medium", () => spacing.s8)
    .with("small", () => spacing.s7)
    .exhaustive();

const getRadius = (size: CheckboxSize) =>
  match(size)
    .with("large", () => "var(--cocso-radius-3)")
    .with("medium", () => "var(--cocso-radius-2)")
    .with("small", () => "var(--cocso-radius-1)")
    .exhaustive();

const getBorderColor = (status: CheckboxStatus) =>
  match(status)
    .with("on", () => colors.primary500)
    .with("intermediate", () => colors.primary500)
    .with("off", () => colors.neutral100)
    .exhaustive();

const getBackgroundColor = (status: CheckboxStatus) =>
  match(status)
    .with("on", () => colors.primary500)
    .with("intermediate", () => colors.primary500)
    .with("off", () => colors.white)
    .exhaustive();
