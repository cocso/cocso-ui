import { Popover as PopoverBase } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cn } from "../cn";
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

export const Popover = Object.assign(PopoverBase.Root, {
  Trigger: PopoverBase.Trigger,
  Content: PopoverContent,
});
