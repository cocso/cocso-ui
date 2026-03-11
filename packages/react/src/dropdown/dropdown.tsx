import { Menu as MenuBase } from "@base-ui/react/menu";
import { clsx as cx } from "clsx";
import type { ComponentProps } from "react";
import styles from "./dropdown.module.css";

function DropdownContent({
  className,
  ...props
}: ComponentProps<typeof MenuBase.Popup>) {
  return (
    <MenuBase.Portal>
      <MenuBase.Positioner>
        <MenuBase.Popup
          className={cx(styles.content, className)}
          {...props}
        />
      </MenuBase.Positioner>
    </MenuBase.Portal>
  );
}

function DropdownItem({
  className,
  ...props
}: ComponentProps<typeof MenuBase.Item>) {
  return (
    <MenuBase.Item className={cx(styles.item, className)} {...props} />
  );
}

export const Dropdown = Object.assign(MenuBase.Root, {
  Trigger: MenuBase.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
});
