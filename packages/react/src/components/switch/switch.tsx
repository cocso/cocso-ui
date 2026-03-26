import type { ComponentProps, CSSProperties } from "react";
import { useId } from "react";
import { cn } from "../../cn";
import { Switch as SwitchBase } from "../../primitives/switch";
import { Typography } from "../typography";
import styles from "./switch.module.css";
import {
  getCheckedColor,
  getSwitchHeight,
  getSwitchWidth,
  getThumbOffset,
  getThumbSize,
  type SwitchSize,
  type SwitchVariant,
  UNCHECKED_BG,
} from "./switch.styles";

export type { SwitchSize, SwitchVariant } from "./switch.styles";

export interface SwitchProps extends ComponentProps<typeof SwitchBase.Root> {
  disabled?: boolean;
  id?: string;
  label?: string;
  position?: "left" | "right";
  size?: SwitchSize;
  variant?: SwitchVariant;
}

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
    "--cocso-switch-bg-color": UNCHECKED_BG,
    "--cocso-switch-checked-bg-color": getCheckedColor(variant),
  } as CSSProperties;

  return (
    <div
      className={cn(styles.wrapper, className)}
      data-disabled={disabled || undefined}
      style={style}
    >
      {position === "left" && (
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
