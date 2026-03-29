import { radio } from "@cocso-ui/codegen/generated/radio";
import "@cocso-ui/codegen/generated/radio.css";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Radio as RadioBase } from "../../primitives/radio";
import { RadioGroup as RadioGroupBase } from "../../primitives/radio-group";
import styles from "./radio-group.module.css";

/** Inline type alias — codegen is a devDependency and must not leak into published .d.ts */
export type RadioSize = "large" | "medium" | "small";

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
      className={cn(radio({ size }), styles.item, className)}
      style={style}
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
  displayName: "RadioGroup" as const,
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
