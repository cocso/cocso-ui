"use client";

import { switchStyles } from "@cocso-ui/codegen/generated/switch";
import "@cocso-ui/codegen/generated/switch.css";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { cn } from "../../cn";
import { Switch as SwitchBase } from "../../primitives/switch";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./switch.module.css";

export type SwitchSize = "large" | "medium" | "small";
export type SwitchVariant =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info";

const UNCHECKED_BG = colors.neutral100;

export interface SwitchProps extends ComponentProps<typeof SwitchBase.Root> {
  disabled?: boolean;
  id?: string;
  label?: string;
  position?: "left" | "right";
  size?: SwitchSize;
  variant?: SwitchVariant;
}

/** Toggle switch component with optional label and size options. */
export function Switch({
  ref,
  id: _id,
  className,
  style: _style,
  size = "medium",
  variant = "primary",
  position = "right",
  disabled,
  checked,
  label,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const switchStylesName = switchStyles({
    variant,
    size,
    checked: String(!!checked) as "true" | "false",
  });
  const style = {
    ..._style,
    "--cocso-switch-bg-color": UNCHECKED_BG,
  } as CSSProperties;

  return (
    <div
      className={cn(switchStylesName, styles.wrapper, className)}
      data-disabled={disabled || undefined}
      style={style}
    >
      {position === "left" && label && (
        <Typography
          aria-disabled={disabled}
          render={<label htmlFor={id}>{label}</label>}
          size={size}
          type="body"
        />
      )}
      <SwitchBase.Root
        checked={checked}
        className={styles.switch}
        disabled={disabled}
        id={id}
        ref={ref}
        {...props}
      >
        <SwitchBase.Thumb className={styles.thumb} />
      </SwitchBase.Root>
      {position === "right" && label && (
        <Typography
          aria-disabled={disabled}
          render={<label htmlFor={id}>{label}</label>}
          size={size}
          type="body"
        />
      )}
    </div>
  );
}
