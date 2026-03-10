// TODO: @radix-ui/react-one-time-password-field has no Base UI equivalent.
// See: https://github.com/mui/base-ui/issues/75
// This component needs to be migrated to a different solution (e.g., input-otp) in a future iteration.
// For now, this is a temporary stub that maintains the component's public API shape.
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './one-time-password-field.module.css';

export interface OneTimePasswordFieldRootProps extends ComponentPropsWithoutRef<'div'> {
  value?: string;
  onValueChange?: (value: string) => void;
  maxLength?: number;
}

export interface OneTimePasswordFieldInputProps extends ComponentPropsWithoutRef<'input'> {
  index?: number;
}

const OneTimePasswordFieldRoot = forwardRef<HTMLDivElement, OneTimePasswordFieldRootProps>(
  ({ className, ...props }, ref) => {
    return <div className={cx(styles.otp, className)} ref={ref} {...props} />;
  }
);

const OneTimePasswordFieldInput = forwardRef<HTMLInputElement, OneTimePasswordFieldInputProps>(
  ({ className, ...props }, ref) => {
    return <input className={cx(styles.input, className)} ref={ref} {...props} />;
  }
);

export const OneTimePasswordField = Object.assign(OneTimePasswordFieldRoot, {
  Input: OneTimePasswordFieldInput,
});
