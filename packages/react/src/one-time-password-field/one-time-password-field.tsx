import { clsx as cx } from "clsx";
import type { OTPInputProps, SlotProps } from "input-otp";
import { OTPInput } from "input-otp";
import { forwardRef } from "react";
import styles from "./one-time-password-field.module.css";

export interface OneTimePasswordFieldProps
  extends Omit<OTPInputProps, "onChange" | "render" | "children"> {
  className?: string;
  onValueChange?: (value: string) => void;
  slotClassName?: string;
}

const Slot = ({
  char,
  hasFakeCaret,
  isActive,
  placeholderChar,
}: SlotProps & { className?: string }) => (
  <div
    className={cx(styles.slot, isActive && styles.slotActive)}
    data-active={isActive || undefined}
  >
    {char ?? placeholderChar}
    {hasFakeCaret && <div className={styles.caret} />}
  </div>
);

export const OneTimePasswordField = forwardRef<
  HTMLInputElement,
  OneTimePasswordFieldProps
>(({ className, slotClassName, onValueChange, ...props }, ref) => (
  <OTPInput
    containerClassName={cx(styles.otp, className)}
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
));
