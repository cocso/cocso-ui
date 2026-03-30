import { tag } from "@cocso-ui/codegen/generated/tag";
import "@cocso-ui/codegen/generated/tag.css";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import styles from "./tag.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type TagVariant = "solid" | "subtle" | "outline";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps extends ComponentProps<"span"> {
  onRemove?: () => void;
  removeLabel?: string;
  size?: TagSize;
  variant?: TagVariant;
}

/** Compact label or category indicator with optional remove button. */
export function Tag({
  ref,
  className,
  style,
  variant = "subtle",
  size = "md",
  onRemove,
  removeLabel = "Remove",
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(tag({ variant, size }), styles.tag, className)}
      ref={ref}
      style={style}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      {onRemove && (
        <button
          aria-label={removeLabel}
          className={styles.remove}
          onClick={onRemove}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
