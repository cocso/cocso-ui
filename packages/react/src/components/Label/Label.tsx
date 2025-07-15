import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

export type LabelProps = {
  asChild?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'label'>;

const LabelComponent = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      asChild = false,
      size = 'md',
      color = 'text.basic',
      weight = 'normal',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const variants = { size };
    const classNames = createClassName('cocso-label', variants, [], className);

    const Comp = asChild ? Slot : 'label';

    return (
      <Comp
        ref={ref}
        className={classNames}
        style={
          {
            '--cocso-label-color': createColor(color),
            '--cocso-label-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Label = Object.assign(LabelComponent, {
  displayName: 'Label',
});
