import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Popover as PopoverBase } from "../../primitives/popover";
import styles from "./popover.module.css";

function PopoverArrow({
  className,
  ...props
}: ComponentProps<typeof PopoverBase.Arrow>) {
  return (
    <PopoverBase.Arrow className={cn(styles.arrow, className)} {...props} />
  );
}

function PopoverContent({
  className,
  side,
  sideOffset,
  align,
  alignOffset,
  arrowPadding,
  ...props
}: ComponentProps<typeof PopoverBase.Popup> &
  Pick<
    ComponentProps<typeof PopoverBase.Positioner>,
    "side" | "sideOffset" | "align" | "alignOffset" | "arrowPadding"
  >) {
  return (
    <PopoverBase.Portal>
      <PopoverBase.Positioner
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverBase.Popup
          className={cn(styles.content, className)}
          {...props}
        />
      </PopoverBase.Positioner>
    </PopoverBase.Portal>
  );
}

export const Popover = Object.assign(PopoverBase.Root, {
  displayName: "Popover" as const,
  Trigger: PopoverBase.Trigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
});
