"use client";

import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./selection-chip.module.css";

export interface SelectionChipProps
  extends Omit<ComponentProps<"button">, "type"> {
  /**
   * Whether everything this chip stands for is currently selected. Drawn in
   * the primary tint and exposed as `aria-pressed`, so the state is not
   * carried by colour alone.
   */
  active?: boolean;
}

/**
 * A bulk-selection chip, placed above a multi-select list.
 *
 * "Select all", "select every tagged item", a group name — a button that adds
 * or removes several items at once. `active` shows that every item it targets
 * is already selected, so pressing it again clears them.
 */
export function SelectionChip({
  ref,
  className,
  active = false,
  ...props
}: SelectionChipProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(styles.chip, active && styles.active, className)}
      data-active={active || undefined}
      data-cocso-component="selection-chip"
      ref={ref}
      type="button"
      {...props}
    />
  );
}
