import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './popover.module.css';

const PopoverContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => {
  return <Content ref={ref} className={cx(styles.content, className)} {...props} />;
});

export const Popover = Object.assign(Root, {
  Trigger,
  Portal,
  Content: PopoverContent,
});
