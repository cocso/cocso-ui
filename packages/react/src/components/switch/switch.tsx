"use client";

import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { resolveStyleMap } from "@cocso-ui/recipe/resolvers/react-styles";
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

const SWITCH_WIDTH: Record<SwitchSize, string> = {
  large: "40px",
  medium: "36px",
  small: "32px",
};

const SWITCH_HEIGHT: Record<SwitchSize, string> = {
  large: "22px",
  medium: "20px",
  small: "18px",
};

const THUMB_SIZE: Record<SwitchSize, string> = {
  large: "18px",
  medium: "16px",
  small: "14px",
};

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
  label,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const resolved = resolveStyleMap(switchRecipe, { variant });
  const style = {
    ..._style,
    "--cocso-switch-width": SWITCH_WIDTH[size],
    "--cocso-switch-height": SWITCH_HEIGHT[size],
    "--cocso-switch-thumb-width": THUMB_SIZE[size],
    "--cocso-switch-thumb-height": THUMB_SIZE[size],
    "--cocso-switch-thumb-offset": "2px",
    "--cocso-switch-bg-color": UNCHECKED_BG,
    "--cocso-switch-checked-bg-color":
      resolved["--cocso-switch-checked-bg-color"],
  } as CSSProperties;

  return (
    <div
      className={cn(styles.wrapper, className)}
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
