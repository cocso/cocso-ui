import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Tooltip as TooltipBase } from "../../primitives/tooltip";
import styles from "./tooltip.module.css";

function TooltipArrow({
  className,
  ...props
}: ComponentProps<typeof TooltipBase.Arrow>) {
  return <TooltipBase.Arrow className={cn(styles.arrow, className)} {...props} />;
}

function TooltipContent({
  className,
  side,
  sideOffset,
  align,
  alignOffset,
  arrowPadding,
  ...props
}: ComponentProps<typeof TooltipBase.Popup> &
  Pick<
    ComponentProps<typeof TooltipBase.Positioner>,
    "side" | "sideOffset" | "align" | "alignOffset" | "arrowPadding"
  >) {
  return (
    <TooltipBase.Portal>
      <TooltipBase.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
      >
        <TooltipBase.Popup
          className={cn(styles.content, className)}
          {...props}
        />
      </TooltipBase.Positioner>
    </TooltipBase.Portal>
  );
}

export const Tooltip = Object.assign(TooltipBase.Root, {
  Trigger: TooltipBase.Trigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Provider: TooltipBase.Provider,
});
