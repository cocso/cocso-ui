import { OTPInput, type OTPInputProps, type SlotProps } from 'input-otp';
import { clsx as cx } from 'clsx';
import { forwardRef } from 'react';
import styles from './one-time-password-field.module.css';

export interface OneTimePasswordFieldProps
  extends Omit<OTPInputProps, 'onChange' | 'render' | 'children'> {
  onValueChange?: (value: string) => void;
  className?: string;
  slotClassName?: string;
}

function Slot({ char, hasFakeCaret, isActive, placeholderChar }: SlotProps & { className?: string }) {
  return (
    <div
      className={cx(styles.slot, isActive && styles.slotActive)}
      data-active={isActive || undefined}
    >
      {char ?? placeholderChar}
      {hasFakeCaret && <div className={styles.caret} />}
    </div>
  );
}

export const OneTimePasswordField = forwardRef<HTMLInputElement, OneTimePasswordFieldProps>(
  ({ className, slotClassName, onValueChange, ...props }, ref) => {
    return (
      <OTPInput
        ref={ref}
        onChange={onValueChange}
        containerClassName={cx(styles.otp, className)}
        render={({ slots }) => (
          <>
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} className={slotClassName} />
            ))}
          </>
        )}
        {...props}
      />
    );
  }
);
