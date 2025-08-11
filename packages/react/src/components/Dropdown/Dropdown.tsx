import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';

const DropdownContent = forwardRef<
  ComponentRef<typeof DropdownPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-dropdown-content', {}, [], className);
  return <DropdownPrimitive.Content ref={ref} className={classNames} {...props} />;
});

const DropdownItem = forwardRef<
  ComponentRef<typeof DropdownPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-dropdown-item', {}, [], className);
  return <DropdownPrimitive.Item ref={ref} className={classNames} {...props} />;
});

export const Dropdown = Object.assign(DropdownPrimitive.Root, {
  Trigger: DropdownPrimitive.Trigger,
  Portal: DropdownPrimitive.Portal,
  Content: DropdownContent,
  Item: DropdownItem,
});
