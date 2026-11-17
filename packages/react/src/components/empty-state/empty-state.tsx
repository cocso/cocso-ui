import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./empty-state.module.css";

export interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  /** A button placed under the text. Usually a single "add" action. */
  action?: ReactNode;
  /**
   * Rendered above the title, in the same frame — a `Spinner` while loading,
   * or an illustration. Loading, failure and empty share one frame so the
   * three states stand in the same place at the same size.
   */
  children?: ReactNode;
  /** Why being empty is expected here, or what to do next. */
  description?: ReactNode;
  /** One bold line that says what is missing. */
  title?: ReactNode;
}

/**
 * The empty state of a region that is not a table.
 *
 * Inside a table, use the table's own empty row — it has to span the columns.
 * Outside one (a list inside a card, a section of a popup), bare text floating
 * in the layout reads as "something went wrong". The dashed frame marks out
 * the place the content would occupy, so the screen says first that being
 * empty is normal.
 */
export function EmptyState({
  ref,
  className,
  title,
  description,
  action,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(styles.root, className)}
      data-cocso-component="empty-state"
      ref={ref}
      {...props}
    >
      {children}
      {title && (
        <Typography size="small" type="body" weight="medium">
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          className={styles.description}
          color={colors.textSecondary}
          size="x-small"
          type="body"
        >
          {description}
        </Typography>
      )}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
