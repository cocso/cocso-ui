import { skeleton } from "@cocso-ui/codegen/generated/skeleton";
import "@cocso-ui/codegen/generated/skeleton.css";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import styles from "./skeleton.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type SkeletonVariant = "text" | "circular" | "rectangular";
export type SkeletonAnimation = "pulse" | "wave" | "none";

export interface SkeletonProps extends ComponentProps<"div"> {
  animation?: SkeletonAnimation;
  /** Shorthand for `variant="circular"` — an avatar or icon placeholder. */
  circle?: boolean;
  /** Block size. A number is read as pixels; a string is used as-is. */
  height?: number | string;
  variant?: SkeletonVariant;
  /** Inline size. A number is read as pixels; a string is used as-is. */
  width?: number | string;
}

const toLength = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : value;

/** Loading placeholder with configurable shape and animation. */
export function Skeleton({
  ref,
  className,
  style: _style,
  variant = "text",
  animation = "pulse",
  circle = false,
  width,
  height,
  ...props
}: SkeletonProps) {
  const resolvedVariant: SkeletonVariant = circle ? "circular" : variant;

  // The size feeds the custom properties the module already reads, so a
  // consumer's own `style.width` / `style.height` still wins over these.
  const style = {
    ...(width === undefined
      ? {}
      : { "--cocso-skeleton-width": toLength(width) }),
    ...(height === undefined
      ? {}
      : { "--cocso-skeleton-height": toLength(height) }),
    ..._style,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cn(
        skeleton({ variant: resolvedVariant, animation }),
        styles.skeleton,
        animation === "pulse" && styles.pulse,
        animation === "wave" && styles.wave,
        className
      )}
      ref={ref}
      style={style}
      {...props}
    />
  );
}
