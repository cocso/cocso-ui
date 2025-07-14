import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

export type HeadingProps = {
  asChild?: boolean;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'h2'>;

const HeadingComponent = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ asChild = false, size = 'md', color, weight = 'bold', className, style, ...props }, ref) => {
    const variants = { size };
    const classNames = createClassName('cocso-heading', variants, [], className);

    const Comp = asChild ? Slot : 'h2';

    return (
      <Comp
        ref={ref}
        className={classNames}
        style={
          {
            '--cocso-heading-color': createColor(color),
            '--cocso-heading-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Heading = Object.assign(HeadingComponent, {
  displayName: 'Heading',
});
