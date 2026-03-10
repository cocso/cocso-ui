import { Menu as MenuBase } from '@base-ui/react/menu';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './dropdown.module.css';

const DropdownContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof MenuBase.Popup>>(
  ({ className, ...props }, ref) => {
    return (
      <MenuBase.Portal>
        <MenuBase.Positioner>
          <MenuBase.Popup className={cx(styles.content, className)} ref={ref} {...props} />
        </MenuBase.Positioner>
      </MenuBase.Portal>
    );
  }
);

const DropdownItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof MenuBase.Item>>(
  ({ className, ...props }, ref) => {
    return <MenuBase.Item className={cx(styles.item, className)} ref={ref} {...props} />;
  }
);

export const Dropdown = Object.assign(MenuBase.Root, {
  Trigger: MenuBase.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
});
