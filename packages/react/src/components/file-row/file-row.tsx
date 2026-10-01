"use client";

import { input } from "@cocso-ui/codegen/generated/input";
import "@cocso-ui/codegen/generated/input.css";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import type { InputSize } from "../input";
import styles from "./file-row.module.css";

export interface FileRowProps extends ComponentProps<"div"> {
  /** Trailing controls — download, print, remove. Usually `svgOnly` Buttons. */
  actions?: ReactNode;
  /**
   * Dims the row and stops the name being a link.
   *
   * It does NOT disable anything in `actions`: those are your elements and
   * only you know whether they stay available on a read-only row. Pass
   * `disabled` to them too when they should not.
   */
  disabled?: boolean;
  /** Draws the boundary in the danger colour. The message belongs to `Field`. */
  error?: boolean;
  /** Makes the name a link — a download, or a preview. */
  href?: string;
  /** The file name. Truncated with an ellipsis rather than wrapped. */
  name: string;
  /** Matches the `Input` it sits beside. */
  size?: InputSize;
  stretch?: boolean;
}

/**
 * One chosen or stored file, on the same line as the inputs around it.
 *
 * The shape comes from the `input` recipe rather than from measurements, the
 * way `InputTrigger` does: height, inline padding, font size and corner all
 * read `--cocso-input-*`. A file row drawn from copied numbers drifts the
 * first time the input scale moves, which is how two apps ended up with rows
 * whose text started 16px inside while every field beside them started at 10.
 *
 * It is a row, not a control: no fill, and nothing here is focusable except
 * the name when it is a link and whatever you pass as `actions`.
 */
export function FileRow({
  ref,
  className,
  name,
  href,
  actions,
  size = "small",
  error = false,
  disabled = false,
  stretch = false,
  ...props
}: FileRowProps) {
  return (
    <div
      className={cn(
        input({ size }),
        styles.row,
        stretch && styles.stretch,
        error && styles.error,
        disabled && styles.disabled,
        className
      )}
      data-cocso-component="file-row"
      data-disabled={disabled || undefined}
      ref={ref}
      {...props}
    >
      {href && !disabled ? (
        <a className={styles.name} href={href}>
          {name}
        </a>
      ) : (
        <span className={styles.name}>{name}</span>
      )}
      {actions && <span className={styles.actions}>{actions}</span>}
    </div>
  );
}
