import type { ComponentProps, ReactNode } from "react";
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
  prefix,
  children,
  ...props
}: Omit<ComponentProps<typeof MenuBase.Item>, "prefix"> & {
  prefix?: ReactNode;
}) {
  return (
    <MenuBase.Item className={cn(styles.item, className)} {...props}>
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      {children}
    </MenuBase.Item>
  );
}

export const Dropdown = Object.assign(MenuBase.Root, {
  Trigger: MenuBase.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
});
Dropdown.displayName = "Dropdown";
