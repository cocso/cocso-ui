"use client";

import { CheckIcon, CheckIndeterminateSmallIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { useId, useRef, useState } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import { Checkbox as CheckboxBase } from "../../primitives/checkbox";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./checkbox.module.css";
import {
  getBackgroundColor,
  getBorderColor,
  getRadius,
  getSize,
} from "./checkbox.styles";

export type CheckboxSize = "large" | "medium" | "small";

export type CheckboxStatus = "on" | "off" | "intermediate";
export interface CheckboxProps
  extends Omit<
    ComponentProps<typeof CheckboxBase.Root>,
    | "checked"
    | "onCheckedChange"
    | "onChange"
    | "indeterminate"
    | "defaultChecked"
  > {
  defaultStatus?: CheckboxStatus;
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange?: (status: "on" | "off") => void;
  size?: CheckboxSize;
  status?: CheckboxStatus;
}

/** Check/uncheck toggle with support for an indeterminate state. */
export function Checkbox({
  ref,
  id: _id,
  className,
  style: _style,
  size = "medium",
  status: statusProp,
  defaultStatus,
  onChange,
  label,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const isControlledRef = useRef(statusProp !== undefined);
  const isControlled = isControlledRef.current;

  if (process.env.NODE_ENV !== "production") {
    if (isControlled !== (statusProp !== undefined)) {
      console.error(
        "Checkbox: switching between controlled and uncontrolled mode is not supported. " +
          "Use `status` (controlled) or `defaultStatus` (uncontrolled) for the component lifetime."
      );
    }
    if (statusProp !== undefined && defaultStatus !== undefined) {
      console.error(
        "Checkbox: `status` and `defaultStatus` are mutually exclusive. " +
          "Use `status` for controlled mode or `defaultStatus` for uncontrolled mode."
      );
    }
  }

  const [internalStatus, setInternalStatus] = useState<CheckboxStatus>(
    defaultStatus ?? "off"
  );
  const status: CheckboxStatus = isControlled
    ? (statusProp as CheckboxStatus)
    : internalStatus;

  const handleCheckedChange = (checked: boolean) => {
    if (!disabled) {
      const nextStatus = checked ? ("on" as const) : ("off" as const);
      if (!isControlled) {
        setInternalStatus(nextStatus);
      }
      onChange?.(nextStatus);
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
