import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './Dropdown.module.css';

const DropdownContent = forwardRef<
  ComponentRef<typeof DropdownPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <DropdownPrimitive.Content ref={ref} className={cx(styles.content, className)} {...props} />
  );
});

const DropdownItem = forwardRef<
  ComponentRef<typeof DropdownPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ className, ...props }, ref) => {
  return <DropdownPrimitive.Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

export const Dropdown = Object.assign(DropdownPrimitive.Root, {
  Trigger: DropdownPrimitive.Trigger,
  Portal: DropdownPrimitive.Portal,
  Content: DropdownContent,
  Item: DropdownItem,
});
