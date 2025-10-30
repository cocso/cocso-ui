import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './RadioGroup.module.css';

const RadioGroupRoot = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root ref={ref} className={cx(styles.root, className)} {...props} />;
});

const RadioGroupItem = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

const RadioGroupIndicator = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Indicator
      ref={ref}
      className={cx(styles.indicator, className)}
      {...props}
    />
  );
});

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
