import { Switch as SwitchBase } from "@base-ui/react/switch";
import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import { colors, spacing } from "../token";
import { Typography } from "../typography";
import styles from "./switch.module.css";

/** Available size variants for the Switch component. */
export type SwitchSize = "small" | "medium" | "large";

/** Available color variants for the Switch checked state. */
export type SwitchVariant = "primary" | "success" | "error" | "warning";

/** Props for the Switch component. */
export interface SwitchProps extends ComponentProps<typeof SwitchBase.Root> {
  /** Whether the switch is disabled. */
  disabled?: boolean;
  /** HTML id applied to the switch input; auto-generated if omitted. */
  id?: string;
  /** Optional label text rendered beside the switch. */
  label?: string;
  /** Side on which the label is rendered relative to the switch. */
  position?: "left" | "right";
  /** Visual size of the switch. */
  size?: SwitchSize;
  /** Color variant applied when the switch is checked. */
  variant?: SwitchVariant;
}

/**
 * A toggle switch with an optional label that can be positioned on either side.
 */
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

  const style = {
    ..._style,
    "--cocso-switch-width": getSwitchWidth(size),
    "--cocso-switch-height": getSwitchHeight(size),
    "--cocso-switch-thumb-width": getThumbSize(size),
    "--cocso-switch-thumb-height": getThumbSize(size),
    "--cocso-switch-thumb-offset": getThumbOffset(size),
    "--cocso-switch-bg-color": colors.neutral100,
    "--cocso-switch-checked-bg-color": getCheckedColor(variant),
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
    .with("large", () => spacing.s15)
    .with("medium", () => spacing.s13)
    .with("small", () => spacing.s11)
    .exhaustive();

const getSwitchHeight = (size: SwitchSize) =>
  match(size)
    .with("large", () => spacing.s10)
    .with("medium", () => spacing.s9)
    .with("small", () => spacing.s8)
    .exhaustive();

const getThumbSize = (size: SwitchSize) =>
  match(size)
    .with("large", () => spacing.s9)
    .with("medium", () => spacing.s8)
    .with("small", () => spacing.s7)
    .exhaustive();

const getThumbOffset = (_size: SwitchSize) => "2px";

const getCheckedColor = (variant: SwitchVariant) =>
  match(variant)
    .with("primary", () => colors.primary500)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning500)
    .exhaustive();
