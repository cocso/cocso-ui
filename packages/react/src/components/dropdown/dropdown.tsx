import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import { Menu as MenuBase } from "../../primitives/menu";
import styles from "./dropdown.module.css";

function DropdownContent({
  className,
  side,
  sideOffset,
  align,
  alignOffset,
  arrowPadding,
  ...props
}: ComponentProps<typeof MenuBase.Popup> &
  Pick<
    ComponentProps<typeof MenuBase.Positioner>,
    "side" | "sideOffset" | "align" | "alignOffset" | "arrowPadding"
  >) {
  return (
    <MenuBase.Portal>
      <MenuBase.Positioner
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        className={styles.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuBase.Popup
          className={cn(styles.content, className)}
          data-cocso-component="dropdown-content"
          {...props}
        />
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
    <MenuBase.Item
      className={cn(styles.item, className)}
      data-cocso-component="dropdown-item"
      {...props}
    >
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      {children}
    </MenuBase.Item>
  );
}

export const Dropdown = Object.assign(MenuBase.Root, {
  displayName: "Dropdown" as const,
  Trigger: MenuBase.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
});
