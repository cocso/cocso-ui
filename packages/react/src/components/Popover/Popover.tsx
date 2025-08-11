import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';

const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-popover-content', {}, [], className);
  return <PopoverPrimitive.Content ref={ref} className={classNames} {...props} />;
});

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Content: PopoverContent,
});
