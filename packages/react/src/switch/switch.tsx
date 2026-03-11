import { Switch as SwitchBase } from "@base-ui/react/switch";
import { cn } from "../cn";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { colors, spacing } from "../token";
import { Typography } from "../typography";
import styles from "./switch.module.css";

export type SwitchSize = "small" | "medium";

export interface SwitchProps
  extends ComponentProps<typeof SwitchBase.Root> {
  disabled?: boolean;
  id?: string;
  label?: string;
  position?: "left" | "right";
  size?: SwitchSize;
}

export function Switch({
  ref,
  id: _id,
  className,
  style: _style,
  size = "medium",
  position = "right",
  disabled,
  label,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const id = _id ?? generatedId;

  const style = {
    ..._style,
    "--cocso-switch-width": getSwitchWidth(size),
    "--cocso-switch-height": getSwitchHeight(size),
    "--cocso-switch-thumb-width": getThumbSize(size),
    "--cocso-switch-thumb-height": getThumbSize(size),
    "--cocso-switch-bg-color": colors.neutral100,
  } as CSSProperties;

  return (
    <div
      aria-disabled={disabled}
      className={cn(styles.wrapper, className)}
      style={style}
    >
      {position === "left" && (
        <Typography
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
      {position === "right" && (
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

const getSwitchWidth = (size: SwitchSize) =>
  match(size)
    .with("medium", () => spacing.s14)
    .with("small", () => spacing.s12)
    .exhaustive();

const getSwitchHeight = (size: SwitchSize) =>
  match(size)
    .with("medium", () => spacing.s10)
    .with("small", () => spacing.s9)
    .exhaustive();

const getThumbSize = (size: SwitchSize) =>
  match(size)
    .with("medium", () => spacing.s9)
    .with("small", () => spacing.s8)
    .exhaustive();
