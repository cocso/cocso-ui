import { Radio as RadioBase } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupBase } from "@base-ui/react/radio-group";
import { clsx as cx } from "clsx";
import type { ComponentProps } from "react";
import styles from "./radio-group.module.css";

function RadioGroupRoot({
  className,
  ...props
}: ComponentProps<typeof RadioGroupBase>) {
  return (
    <RadioGroupBase className={cx(styles.root, className)} {...props} />
  );
}

function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioBase.Root>) {
  return (
    <RadioBase.Root className={cx(styles.item, className)} {...props} />
  );
}

function RadioGroupIndicator({
  className,
  ...props
}: ComponentProps<typeof RadioBase.Indicator>) {
  return (
    <RadioBase.Indicator
      className={cx(styles.indicator, className)}
      {...props}
    />
  );
}

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
