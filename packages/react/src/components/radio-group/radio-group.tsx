import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Radio as RadioBase } from "../../primitives/radio";
import { RadioGroup as RadioGroupBase } from "../../primitives/radio-group";
import styles from "./radio-group.module.css";
import type { RadioSize } from "./radio-group.styles";
import { sizeVars } from "./radio-group.styles";

export type { RadioSize } from "./radio-group.styles";

function RadioGroupRoot({
  className,
  ...props
}: ComponentProps<typeof RadioGroupBase>) {
  return <RadioGroupBase className={cn(styles.root, className)} {...props} />;
}

function RadioGroupItem({
  className,
  size = "medium",
  style,
  ...props
}: ComponentProps<typeof RadioBase.Root> & { size?: RadioSize }) {
  return (
    <RadioBase.Root
      className={cn(styles.item, className)}
      style={{ ...sizeVars[size], ...style }}
      {...props}
    />
  );
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

/**
 * Single-selection radio group. Compose with `RadioGroup.Item` and `RadioGroup.Indicator`.
 */
export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
RadioGroup.displayName = "RadioGroup";
