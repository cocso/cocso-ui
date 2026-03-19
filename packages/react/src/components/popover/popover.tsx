import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Popover as PopoverBase } from "../../primitives/popover";
import styles from "./popover.module.css";

function PopoverContent({
  className,
  ...props
}: ComponentProps<typeof PopoverBase.Popup>) {
  return (
    <PopoverBase.Portal>
      <PopoverBase.Positioner>
        <PopoverBase.Popup
          className={cn(styles.content, className)}
          {...props}
        />
      </PopoverBase.Positioner>
    </PopoverBase.Portal>
  );
}

/**
 * A popover component composed of a Root, Trigger, and Content.
 * Wraps Base UI's Popover with portal and positioner handling built in.
 *
 * @example
 * <Popover>
 *   <Popover.Trigger>Open</Popover.Trigger>
 *   <Popover.Content>...</Popover.Content>
 * </Popover>
 */
export const Popover = Object.assign(PopoverBase.Root, {
  Trigger: PopoverBase.Trigger,
  Content: PopoverContent,
});
