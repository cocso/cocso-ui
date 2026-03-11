import { Radio as RadioBase } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupBase } from "@base-ui/react/radio-group";
import { clsx as cx } from "clsx";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import styles from "./radio-group.module.css";

const RadioGroupRoot = forwardRef<
  ComponentRef<typeof RadioGroupBase>,
  ComponentPropsWithoutRef<typeof RadioGroupBase>
>(({ className, ...props }, ref) => (
  <RadioGroupBase className={cx(styles.root, className)} ref={ref} {...props} />
));

const RadioGroupItem = forwardRef<
  ComponentRef<typeof RadioBase.Root>,
  ComponentPropsWithoutRef<typeof RadioBase.Root>
>(({ className, ...props }, ref) => (
  <RadioBase.Root className={cx(styles.item, className)} ref={ref} {...props} />
));

const RadioGroupIndicator = forwardRef<
  ComponentRef<typeof RadioBase.Indicator>,
  ComponentPropsWithoutRef<typeof RadioBase.Indicator>
>(({ className, ...props }, ref) => (
  <RadioBase.Indicator
    className={cx(styles.indicator, className)}
    ref={ref}
    {...props}
  />
));

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
