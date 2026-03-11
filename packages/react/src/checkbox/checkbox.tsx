import { Checkbox as CheckboxBase } from "@base-ui/react/checkbox";
import { CheckIcon, CheckIndeterminateSmallIcon } from "@cocso-ui/react-icons";
import { cn } from "../cn";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { colors, spacing } from "../token";
import { Typography } from "../typography";
import styles from "./checkbox.module.css";

export type CheckboxSize = "large" | "medium" | "small";

export type CheckboxStatus = "on" | "off" | "intermediate";

export interface CheckboxProps
  extends Omit<
    ComponentProps<typeof CheckboxBase.Root>,
    "checked" | "onCheckedChange" | "onChange" | "indeterminate"
  > {
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange: (status: CheckboxStatus) => void;
  size?: CheckboxSize;
  status: CheckboxStatus;
}

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

  const getCheckedState = (): { checked: boolean; indeterminate: boolean } =>
    match(status)
      .with("on", () => ({ checked: true, indeterminate: false }))
      .with("intermediate", () => ({ checked: false, indeterminate: true }))
      .with("off", () => ({ checked: false, indeterminate: false }))
      .exhaustive();

  const style = {
    ..._style,
    "--cocso-checkbox-size": getSize(size),
    "--cocso-checkbox-color": colors.white,
    "--cocso-checkbox-border-color": getBorderColor(status),
    "--cocso-checkbox-bg-color": getBackgroundColor(status),
  } as CSSProperties;

  const checkedState = getCheckedState();

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

const getSize = (size: CheckboxSize) =>
  match(size)
    .with("large", () => spacing.s10)
    .with("medium", () => spacing.s9)
    .with("small", () => spacing.s8)
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
