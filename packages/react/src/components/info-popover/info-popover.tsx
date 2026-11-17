"use client";

import { InfoIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "../../cn";
import { Popover } from "../popover";
import styles from "./info-popover.module.css";

type PopoverRootProps = ComponentProps<typeof Popover>;
type PopoverContentProps = ComponentProps<typeof Popover.Content>;

export interface InfoPopoverProps
  extends Pick<PopoverRootProps, "defaultOpen" | "open" | "onOpenChange">,
    Pick<PopoverContentProps, "side" | "align"> {
  /** The explanation the icon opens. */
  children: ReactNode;
  /** Class for the panel. */
  className?: string;
  /** Size of the icon in pixels. Defaults to `14`. */
  iconSize?: number;
  /**
   * Accessible name of the icon button, and of the panel it opens. The icon
   * carries no text, so this is all a screen reader announces. Defaults to
   * `"More information"`.
   */
  label?: string;
  /** Class for the icon button. */
  triggerClassName?: string;
  /**
   * Width of the panel. A number is pixels. Defaults to 300px; widen it for
   * longer sentences. Never wider than the viewport less 32px.
   */
  width?: number | string;
}

/**
 * An info icon that folds away an explanation that never changes — how a
 * total is summed, why a duplicate is refused — so the card it explains stays
 * short.
 *
 * Guidance that changes with the value or the state should stay on the page
 * instead: folding it away hides exactly when it matters.
 *
 * Built on `Popover`, so the panel is a labelled dialog on the popover layer
 * and keeps Popover's `popover-content` / `popover-positioner` hooks, as the
 * pickers do. The icon button is `info-popover-trigger`.
 */
export function InfoPopover({
  children,
  className,
  iconSize = 14,
  label = "More information",
  triggerClassName,
  width = 300,
  side,
  align,
  ...rootProps
}: InfoPopoverProps) {
  const style = {
    "--cocso-info-popover-width":
      typeof width === "number" ? `${width}px` : width,
  } as CSSProperties;

  return (
    <Popover {...rootProps}>
      <Popover.Trigger
        aria-label={label}
        className={cn(styles.trigger, triggerClassName)}
        data-cocso-component="info-popover-trigger"
      >
        <InfoIcon aria-hidden="true" size={iconSize} />
      </Popover.Trigger>
      <Popover.Content
        align={align}
        aria-label={label}
        className={cn(styles.content, className)}
        side={side}
        style={style}
      >
        {children}
      </Popover.Content>
    </Popover>
  );
}
