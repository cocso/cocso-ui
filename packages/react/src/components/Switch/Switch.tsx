import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { createClassName } from '../../utils/cn';
import { Label } from '../Label';

export type SwitchProps = {
  asChild?: boolean;
  id: string;
  size?: 'lg' | 'md';
  disabled?: boolean;
  label?: string;
  position?: 'left' | 'right';
} & React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

const SwitchComponent = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      asChild = false,
      id,
      size = 'md',
      disabled = false,
      label,
      position = 'right',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const switchClassNames = createClassName('cocso-switch', { size, disabled }, [], className);
    const thumbClassNames = createClassName('cocso-switch-thumb', { size });

    const Comp = asChild ? Slot : 'div';

    return (
      <Comp className="cocso-switch-wrapper">
        {position === 'left' && (
          <Label size={size} htmlFor={id}>
            {label}
          </Label>
        )}
        <SwitchPrimitive.Root ref={ref} className={switchClassNames} {...props}>
          <SwitchPrimitive.Thumb className={thumbClassNames} />
        </SwitchPrimitive.Root>
        {position === 'right' && (
          <Label size={size} htmlFor={id}>
            {label}
          </Label>
        )}
      </Comp>
    );
  },
);

export const Switch = Object.assign(SwitchComponent, {
  displayName: 'Switch',
});
