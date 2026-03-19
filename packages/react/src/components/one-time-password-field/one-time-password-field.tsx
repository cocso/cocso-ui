import type { SlotProps } from "input-otp";
import { OTPInput } from "input-otp";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./one-time-password-field.module.css";

/** Props for the {@link OneTimePasswordField} component. */
export interface OneTimePasswordFieldProps
  extends Omit<
    ComponentProps<typeof OTPInput>,
    "onChange" | "render" | "children"
  > {
  /** Additional class name applied to the OTP container. */
  className?: string;
  /** Callback invoked with the full OTP string whenever the value changes. */
  onValueChange?: (value: string) => void;
  /** Additional class name applied to each individual slot element. */
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

/** A one-time password input that renders individual styled slots for each character using the `input-otp` library. */
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
