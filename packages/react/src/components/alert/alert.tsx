import { alert } from "@cocso-ui/codegen/generated/alert";
import "@cocso-ui/codegen/generated/alert.css";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import styles from "./alert.module.css";

/** Inline type alias — codegen is a devDependency and must not leak into published .d.ts */
export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends ComponentProps<"div"> {
  icon?: ReactNode;
  onClose?: () => void;
  variant?: AlertVariant;
}

/** Contextual feedback message with optional icon and close button. */
export function Alert({
  ref,
  className,
  style,
  variant = "info",
  icon,
  onClose,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(alert({ variant }), styles.alert, className)}
      ref={ref}
      role="alert"
      style={style}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.content}>{children}</div>
      {onClose && (
        <button
          aria-label="Close"
          className={styles.close}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}
