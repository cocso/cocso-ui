import { Input, Root } from '@radix-ui/react-one-time-password-field';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './one-time-password-field.module.css';

const OneTimePasswordFieldRoot = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  return <Root className={cx(styles.otp, className)} ref={ref} {...props} />;
});

const OneTimePasswordFieldInput = forwardRef<
  ComponentRef<typeof Input>,
  ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return <Input className={cx(styles.input, className)} ref={ref} {...props} />;
});

export const OneTimePasswordField = Object.assign(OneTimePasswordFieldRoot, {
  Input: OneTimePasswordFieldInput,
});
