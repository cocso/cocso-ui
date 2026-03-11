import { clsx as cx } from "clsx";
import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import type { ResponsiveFontSize } from "../token";
import { colors } from "../token";
import { Typography } from "../typography";
import styles from "./badge.module.css";

type BadgeSize = "small" | "medium" | "large";

type BadgeVariant = "default" | "danger" | "primary" | "success" | "warning";

export interface BadgeProps extends ComponentProps<"div"> {
  size?: BadgeSize;
  variant?: BadgeVariant;
}

export function Badge({
  ref,
  className,
  children,
  size = "medium",
  variant = "default",
  style: _style,
  ...props
}: BadgeProps) {
  const style = {
    ..._style,
    "--cocso-badge-padding": getPadding(size),
    "--cocso-badge-border-radius": "6px",
    "--cocso-badge-bg-color": getBackgroundColor(variant),
  } as CSSProperties;

  const fontColor = getFontColor(variant);
  const fontSize = getFontSize(size);

  return (
    <div
      className={cx(styles.badge, className)}
      ref={ref}
      style={style}
      {...props}
    >
      <Typography
        color={fontColor}
        lineHeight="tight"
        render={<span className={styles.inner}>{children}</span>}
        size={fontSize as ResponsiveFontSize}
        weight="medium"
      />
    </div>
  );
}

const getPadding = (size: BadgeSize) =>
  match(size)
    .with("small", () => "4px 8px")
    .with("medium", () => "6px 10px")
    .with("large", () => "8px 12px")
    .exhaustive();

const getFontSize = (size: BadgeSize) =>
  match(size)
    .with("small", () => 12)
    .with("medium", () => 14)
    .with("large", () => 16)
    .exhaustive();

const getFontColor = (variant: BadgeVariant) =>
  match(variant)
    .with("default", () => colors.neutral600)
    .with("danger", () => colors.danger600)
    .with("primary", () => colors.primary600)
    .with("success", () => colors.success600)
    .with("warning", () => colors.warning600)
    .exhaustive();

const getBackgroundColor = (variant: BadgeVariant) =>
  match(variant)
    .with("default", () => colors.neutral50)
    .with("danger", () => colors.danger50)
    .with("primary", () => colors.primary50)
    .with("success", () => colors.success50)
    .with("warning", () => colors.warning50)
    .exhaustive();
