import { skeleton } from "@cocso-ui/codegen/generated/skeleton";
import "@cocso-ui/codegen/generated/skeleton.css";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./skeleton.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type SkeletonVariant = "text" | "circular" | "rectangular";
export type SkeletonAnimation = "pulse" | "wave" | "none";

export interface SkeletonProps extends ComponentProps<"div"> {
  animation?: SkeletonAnimation;
  variant?: SkeletonVariant;
}

/** Loading placeholder with configurable shape and animation. */
export function Skeleton({
  ref,
  className,
  style,
  variant = "text",
  animation = "pulse",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        skeleton({ variant, animation }),
        styles.skeleton,
        animation === "pulse" && styles.pulse,
        animation === "wave" && styles.wave,
        className,
      )}
      ref={ref}
      style={style}
      {...props}
    />
  );
}
