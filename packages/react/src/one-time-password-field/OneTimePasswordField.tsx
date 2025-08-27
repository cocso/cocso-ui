import * as OneTimePasswordFieldPrimitive from '@radix-ui/react-one-time-password-field';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './OneTimePasswordField.module.css';

const OneTimePasswordFieldRoot = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.Root>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <OneTimePasswordFieldPrimitive.Root
      ref={ref}
      className={cx(styles.otp, className)}
      {...props}
    />
  );
});

const OneTimePasswordFieldInput = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.Input>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Input>
>(({ className, ...props }, ref) => {
  return (
    <OneTimePasswordFieldPrimitive.Input
      ref={ref}
      className={cx(styles.input, className)}
      {...props}
    />
  );
});

export const OneTimePasswordField = Object.assign(OneTimePasswordFieldRoot, {
  Input: OneTimePasswordFieldInput,
});
