import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

export type DisplayProps = {
  asChild?: boolean;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'h1'>;

const DisplayComponent = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ asChild = false, size = 'md', color, weight = 'bold', className, style, ...props }, ref) => {
    const variants = { size };
    const classNames = createClassName('cocso-display', variants, [], className);

    const Comp = asChild ? Slot : 'h1';

    return (
      <Comp
        ref={ref}
        className={classNames}
        style={
          {
            '--cocso-display-color': createColor(color),
            '--cocso-display-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Display = Object.assign(DisplayComponent, {
  displayName: 'Display',
});
