import { badge } from "@cocso-ui/codegen/generated/badge";
import "@cocso-ui/codegen/generated/badge.css";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import type { ResponsiveFontSize } from "../../token";
import { Typography } from "../typography";
import styles from "./badge.module.css";

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

const BADGE_FONT_SIZES: Record<BadgeSize, number> = {
  large: 14,
  medium: 12,
  small: 11,
};

const BADGE_PADDING_Y: Record<BadgeSize, string> = {
  large: "5px",
  medium: "4px",
  small: "3px",
};

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
    "--cocso-badge-padding-y": BADGE_PADDING_Y[size],
  } as CSSProperties;

  const fontSize = BADGE_FONT_SIZES[size];

  return (
    <div
      className={cn(
        badge({ variant, size, shape }),
        styles.badge,
        shape === "circle" && styles.circle,
        className
      )}
      ref={ref}
      style={style}
      {...props}
    >
      <Typography
        color="currentColor"
        lineHeight="tight"
        render={<span className={styles.inner}>{children}</span>}
        size={fontSize as ResponsiveFontSize}
        type="custom"
        weight="medium"
      />
    </div>
  );
}
