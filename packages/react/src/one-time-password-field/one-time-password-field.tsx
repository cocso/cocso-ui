import { Input, Root } from '@radix-ui/react-one-time-password-field';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './one-time-password-field.module.css';

const OneTimePasswordFieldRoot = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  return <Root ref={ref} className={cx(styles.otp, className)} {...props} />;
});

const OneTimePasswordFieldInput = forwardRef<
  ComponentRef<typeof Input>,
  ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return <Input ref={ref} className={cx(styles.input, className)} {...props} />;
});

export const OneTimePasswordField = Object.assign(OneTimePasswordFieldRoot, {
  Input: OneTimePasswordFieldInput,
});
