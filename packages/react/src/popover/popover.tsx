import { Popover as PopoverBase } from "@base-ui/react/popover";
import { clsx as cx } from "clsx";
import type { ComponentProps } from "react";
import styles from "./popover.module.css";

function PopoverContent({
  className,
  ...props
}: ComponentProps<typeof PopoverBase.Popup>) {
  return (
    <PopoverBase.Portal>
      <PopoverBase.Positioner>
        <PopoverBase.Popup
          className={cx(styles.content, className)}
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
