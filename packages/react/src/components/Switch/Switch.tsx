import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { createClassName } from '../../utils/cn';
import { Label } from '../Label';

type SwitchProps = {
  id: string;
  size?: 'lg' | 'md';
  disabled?: boolean;
  label?: string;
  position?: 'left' | 'right';
} & ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

const SwitchContent = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    { id, size = 'md', disabled = false, label, position = 'right', className, children, ...props },
    ref,
  ) => {
    const classNames = createClassName('cocso-switch', { size, disabled }, [], className);

    return (
      <div className="cocso-switch-wrapper">
        {position === 'left' && (
          <Label size={size} htmlFor={id}>
            {label}
          </Label>
        )}
        <SwitchPrimitive.Root ref={ref} className={classNames} {...props}>
          <SwitchPrimitive.Thumb className={createClassName('cocso-switch-thumb', { size })} />
        </SwitchPrimitive.Root>
        {position === 'right' && (
          <Label size={size} htmlFor={id}>
            {label}
          </Label>
        )}
      </div>
    );
  },
);

export const Switch = Object.assign(SwitchContent, {});
