import { Indicator, Item, Root } from '@radix-ui/react-radio-group';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './radio-group.module.css';

const RadioGroupRoot = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  return <Root ref={ref} className={cx(styles.root, className)} {...props} />;
});

RadioGroupRoot.displayName = Root.displayName;

const RadioGroupItem = forwardRef<
  ComponentRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => {
  return <Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

RadioGroupItem.displayName = Item.displayName;

const RadioGroupIndicator = forwardRef<
  ComponentRef<typeof Indicator>,
  ComponentPropsWithoutRef<typeof Indicator>
>(({ className, ...props }, ref) => {
  return <Indicator ref={ref} className={cx(styles.indicator, className)} {...props} />;
});

RadioGroupIndicator.displayName = Indicator.displayName;

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
