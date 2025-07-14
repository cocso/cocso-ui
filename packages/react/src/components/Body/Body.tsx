import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

export type BodyProps = {
  asChild?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'p'>;

const BodyComponent = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ asChild = false, size = 'md', color, weight = 'normal', className, style, ...props }, ref) => {
    const variants = { size };
    const classNames = createClassName('cocso-body', variants, [], className);

    const Comp = asChild ? Slot : 'p';

    return (
      <Comp
        ref={ref}
        className={classNames}
        style={
          {
            '--cocso-body-color': createColor(color),
            '--cocso-body-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Body = Object.assign(BodyComponent, {
  displayName: 'Body',
});
