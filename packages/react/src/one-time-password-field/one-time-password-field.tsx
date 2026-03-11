import type { SlotProps } from "input-otp";
import { OTPInput } from "input-otp";
import type { ComponentProps } from "react";
import { cn } from "../cn";
import styles from "./one-time-password-field.module.css";

export interface OneTimePasswordFieldProps
  extends Omit<
    ComponentProps<typeof OTPInput>,
    "onChange" | "render" | "children"
  > {
  className?: string;
  onValueChange?: (value: string) => void;
  slotClassName?: string;
}

const Slot = ({
  char,
  className,
  hasFakeCaret,
  isActive,
  placeholderChar,
}: SlotProps & { className?: string }) => (
  <div
    className={cn(styles.slot, isActive && styles.slotActive, className)}
    data-active={isActive || undefined}
  >
    {char ?? placeholderChar}
    {hasFakeCaret && <div className={styles.caret} />}
  </div>
);

export function OneTimePasswordField({
  className,
  slotClassName,
  onValueChange,
  ref,
  ...props
}: OneTimePasswordFieldProps) {
  return (
    <OTPInput
      containerClassName={cn(styles.otp, className)}
      onChange={onValueChange}
      ref={ref}
      render={({ slots }) => (
        <>
          {[...slots.entries()].map(([i, slot]) => (
            <Slot key={`otp-slot-${i}`} {...slot} className={slotClassName} />
          ))}
        </>
      )}
      {...props}
    />
  );
}
