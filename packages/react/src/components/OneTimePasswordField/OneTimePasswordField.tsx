import * as OneTimePasswordFieldPrimitive from '@radix-ui/react-one-time-password-field';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';

const OneTimePasswordFieldRoot = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.Root>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Root>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-otp', {}, [], className);
  return <OneTimePasswordFieldPrimitive.Root ref={ref} className={classNames} {...props} />;
});

const OneTimePasswordFieldInput = forwardRef<
  ComponentRef<typeof OneTimePasswordFieldPrimitive.Input>,
  ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Input>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-otp-input', {}, [], className);
  return <OneTimePasswordFieldPrimitive.Input ref={ref} className={classNames} {...props} />;
});

export const OneTimePasswordField = Object.assign(OneTimePasswordFieldRoot, {
  Input: OneTimePasswordFieldInput,
});
