import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Menu as MenuBase } from "../../primitives/menu";
import styles from "./dropdown.module.css";

function DropdownContent({
  className,
  ...props
}: ComponentProps<typeof MenuBase.Popup>) {
  return (
    <MenuBase.Portal>
      <MenuBase.Positioner>
        <MenuBase.Popup className={cn(styles.content, className)} {...props} />
      </MenuBase.Positioner>
    </MenuBase.Portal>
  );
}

function DropdownItem({
  className,
  ...props
}: ComponentProps<typeof MenuBase.Item>) {
  return <MenuBase.Item className={cn(styles.item, className)} {...props} />;
}
export const Dropdown = Object.assign(MenuBase.Root, {
  Trigger: MenuBase.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
});
