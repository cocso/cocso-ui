import * as PopoverPrimitive from '@radix-ui/react-popover';
import { clsx as cn } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './Popover.module.css';

const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <PopoverPrimitive.Content ref={ref} className={cn(styles.content, className)} {...props} />
  );
});

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Content: PopoverContent,
});
