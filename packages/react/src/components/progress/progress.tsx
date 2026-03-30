import { progress } from "@cocso-ui/codegen/generated/progress";
import "@cocso-ui/codegen/generated/progress.css";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./progress.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type ProgressVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps extends ComponentProps<"div"> {
  max?: number;
  size?: ProgressSize;
  value: number;
  variant?: ProgressVariant;
}

/** Determinate progress indicator showing completion percentage. */
export function Progress({
  ref,
  className,
  style,
  variant = "primary",
  size = "md",
  value,
  max = 100,
  ...props
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value}
      className={cn(progress({ variant, size }), styles.track, className)}
      ref={ref}
      role="progressbar"
      style={style}
      {...props}
    >
      <div className={styles.fill} style={{ width: `${percentage}%` }} />
    </div>
  );
}
