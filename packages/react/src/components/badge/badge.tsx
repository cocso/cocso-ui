import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import type { ResponsiveFontSize } from "../../token";
import { Typography } from "../typography";
import styles from "./badge.module.css";
import {
  getBackgroundColor,
  getBorder,
  getBorderRadius,
  getFontColor,
  getFontSize,
  getPadding,
  getPaddingY,
} from "./badge.styles";

export type BadgeSize = "large" | "medium" | "small";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "outline";

type BadgeShape = "square" | "circle" | "rounded";
export interface BadgeProps extends ComponentProps<"div"> {
  shape?: BadgeShape;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

/** Inline badge/tag component with color and variant options. */
export function Badge({
  ref,
  className,
  children,
  size = "medium",
  variant = "secondary",
  shape = "square",
  style: _style,
  ...props
}: BadgeProps) {
  const style = {
    ..._style,
    "--cocso-badge-padding": getPadding(size),
    "--cocso-badge-padding-y": getPaddingY(size),
    "--cocso-badge-border-radius": getBorderRadius(shape, size),
    "--cocso-badge-bg-color": getBackgroundColor(variant),
    "--cocso-badge-border": getBorder(variant),
  } as CSSProperties;

  const fontColor = getFontColor(variant);
  const fontSize = getFontSize(size);

  return (
    <div
      className={cn(
        styles.badge,
        shape === "circle" && styles.circle,
        className
      )}
      ref={ref}
      style={style}
      {...props}
    >
      <Typography
        color={fontColor}
        lineHeight="tight"
        render={<span className={styles.inner}>{children}</span>}
        size={fontSize as ResponsiveFontSize}
        type="custom"
        weight="medium"
      />
    </div>
  );
}
