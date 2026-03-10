import { Content, Item, Portal, Root, Trigger } from '@radix-ui/react-dropdown-menu';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './dropdown.module.css';

const DropdownContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => {
  return <Content className={cx(styles.content, className)} ref={ref} {...props} />;
});

const DropdownItem = forwardRef<ComponentRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, ref) => {
    return <Item className={cx(styles.item, className)} ref={ref} {...props} />;
  }
);

export const Dropdown = Object.assign(Root, {
  Trigger,
  Portal,
  Content: DropdownContent,
  Item: DropdownItem,
});
