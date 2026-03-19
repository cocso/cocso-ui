import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import type { ResponsiveFontSize } from "../../token";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./badge.module.css";

export type BadgeSize = "large" | "medium" | "small";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "outline";

type BadgeShape = "square" | "circle" | "rounded";
export interface BadgeProps extends ComponentProps<"div"> {
  shape?: BadgeShape;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

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
        weight="medium"
      />
    </div>
  );
}

const getPaddingY = (size: BadgeSize) =>
  match(size)
    .with("small", () => "3px")
    .with("medium", () => "4px")
    .with("large", () => "5px")
    .exhaustive();

const getBorderRadius = (shape: BadgeShape, size: BadgeSize) =>
  match(shape)
    .with("square", () =>
      size === "small" ? "var(--cocso-radius-3)" : "var(--cocso-radius-4)"
    )
    .with("circle", () => "100%")
    .with("rounded", () => "var(--cocso-radius-full)")
    .exhaustive();

const getPadding = (size: BadgeSize) =>
  match(size)
    .with("small", () => "3px 6px")
    .with("medium", () => "4px 8px")
    .with("large", () => "5px 10px")
    .exhaustive();

const getFontSize = (size: BadgeSize) =>
  match(size)
    .with("small", () => 11)
    .with("medium", () => 12)
    .with("large", () => 14)
    .exhaustive();

const getFontColor = (variant: BadgeVariant) =>
  match(variant)
    .with("secondary", () => colors.neutral600)
    .with("error", () => colors.danger600)
    .with("primary", () => colors.primary600)
    .with("success", () => colors.success600)
    .with("warning", () => colors.warning600)
    .with("outline", () => colors.neutral950)
    .exhaustive();

const getBackgroundColor = (variant: BadgeVariant) =>
  match(variant)
    .with("secondary", () => colors.neutral50)
    .with("error", () => colors.danger50)
    .with("primary", () => colors.primary50)
    .with("success", () => colors.success50)
    .with("warning", () => colors.warning50)
    .with("outline", () => colors.transparent)
    .exhaustive();

const getBorder = (variant: BadgeVariant) =>
  match(variant)
    .with("outline", () => `1px solid ${colors.neutral100}`)
    .otherwise(() => "none");
