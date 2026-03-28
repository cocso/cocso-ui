import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { resolveStyleMap } from "@cocso-ui/recipe/resolvers/react-styles";
import type { ComponentProps, CSSProperties } from "react";
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
  | "info"
  | "outline";

type BadgeShape = "square" | "circle" | "rounded";
export interface BadgeProps extends ComponentProps<"div"> {
  shape?: BadgeShape;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

const BADGE_FONT_COLORS: Record<BadgeVariant, string> = {
  primary: colors.white,
  secondary: colors.neutral600,
  success: colors.success600,
  error: colors.danger600,
  warning: colors.warning600,
  info: colors.info600,
  outline: colors.neutral950,
};

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
  const resolved = resolveStyleMap(badgeRecipe, { variant, size, shape });
  const style = {
    ..._style,
    "--cocso-badge-padding-y": BADGE_PADDING_Y[size],
    ...resolved,
  } as CSSProperties;

  const fontColor = BADGE_FONT_COLORS[variant];
  const fontSize = BADGE_FONT_SIZES[size];

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
