"use client";

import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { colors } from "../../token";
import { Spinner } from "../spinner";
import { Typography } from "../typography";
import styles from "./loading-overlay.module.css";

export interface LoadingOverlayProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** Secondary guidance under the message — how long it takes, not to close the window. */
  description?: string;
  /** The main line under the spinner. Also the spinner's accessible name. */
  message?: string;
  /** Renders the overlay only while true; renders nothing otherwise. */
  open: boolean;
}

/**
 * A layer that covers the whole viewport while a long task runs.
 *
 * For work that takes several seconds and must not be interrupted — an
 * upload, say. It is `position: fixed`, so in a popup window opened with
 * `window.open` it covers that whole window.
 *
 * It blocks the pointer, not the keyboard: content underneath stays in the
 * tab order. Mark it `inert` yourself if the task must not be re-triggered
 * from the keyboard.
 *
 * It sits on `--cocso-z-index-overlay`, the dialog backdrop layer, so it is
 * drawn under an open `Dialog` panel. Override the z-index through
 * `[data-cocso-component="loading-overlay"]` when it has to cover one.
 *
 * @example
 * <LoadingOverlay open={isPending} message="정산 데이터를 업로드하고 있습니다" />
 */
export function LoadingOverlay({
  ref,
  className,
  open,
  message = "처리 중입니다",
  description,
  ...props
}: LoadingOverlayProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-busy="true"
      className={cn(styles.overlay, className)}
      data-cocso-component="loading-overlay"
      ref={ref}
      {...props}
    >
      {/* The spinner is the one live region: an `<output aria-live>` named by
          the message. The visible text repeats that name, so giving it a live
          role of its own would announce the message twice. */}
      <Spinner label={message} size="large" variant="primary" />
      <div className={styles.text}>
        <Typography color={colors.textPrimary} type="body" weight="medium">
          {message}
        </Typography>
        {description && (
          <Typography
            className={styles.description}
            color={colors.textSecondary}
            size="small"
            type="body"
          >
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
}
