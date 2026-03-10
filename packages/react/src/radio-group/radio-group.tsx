import { Indicator, Item, Root } from '@radix-ui/react-radio-group';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './radio-group.module.css';

const RadioGroupRoot = forwardRef<ComponentRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, ...props }, ref) => {
    return <Root className={cx(styles.root, className)} ref={ref} {...props} />;
  }
);

RadioGroupRoot.displayName = Root.displayName;

const RadioGroupItem = forwardRef<ComponentRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, ref) => {
    return <Item className={cx(styles.item, className)} ref={ref} {...props} />;
  }
);

RadioGroupItem.displayName = Item.displayName;

const RadioGroupIndicator = forwardRef<
  ComponentRef<typeof Indicator>,
  ComponentPropsWithoutRef<typeof Indicator>
>(({ className, ...props }, ref) => {
  return <Indicator className={cx(styles.indicator, className)} ref={ref} {...props} />;
});

RadioGroupIndicator.displayName = Indicator.displayName;

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
