import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import { Radio as RadioBase } from "../../primitives/radio";
import { RadioGroup as RadioGroupBase } from "../../primitives/radio-group";
import styles from "./radio-group.module.css";

export type RadioSize = "large" | "medium" | "small";

const sizeVars: Record<RadioSize, CSSProperties> = {
  small: {
    "--cocso-radio-size": "12px",
    "--cocso-radio-dot-size": "5px",
  } as CSSProperties,
  medium: {
    "--cocso-radio-size": "16px",
    "--cocso-radio-dot-size": "7px",
  } as CSSProperties,
  large: {
    "--cocso-radio-size": "20px",
    "--cocso-radio-dot-size": "9px",
  } as CSSProperties,
};

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

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
