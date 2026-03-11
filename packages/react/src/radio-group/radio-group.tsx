import { Radio as RadioBase } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupBase } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";
import { cn } from "../cn";
import styles from "./radio-group.module.css";

function RadioGroupRoot({
  className,
  ...props
}: ComponentProps<typeof RadioGroupBase>) {
  return <RadioGroupBase className={cn(styles.root, className)} {...props} />;
}

function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof RadioBase.Root>) {
  return <RadioBase.Root className={cn(styles.item, className)} {...props} />;
}

function RadioGroupIndicator({
  className,
  ...props
}: ComponentProps<typeof RadioBase.Indicator>) {
  return (
    <RadioBase.Indicator
      className={cn(styles.indicator, className)}
      {...props}
    />
  );
}

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
