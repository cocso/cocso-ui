import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

export type LinkProps = {
  asChild?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  weight?: FontWeightToken;
  indicator?: boolean;
} & React.ComponentPropsWithoutRef<'a'>;

const LinkComponent = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      asChild = false,
      size = 'md',
      weight = 'normal',
      indicator = true,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const variants = { size, indicator };
    const classNames = createClassName('cocso-link', variants, [], className);

    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={ref}
        className={classNames}
        style={
          {
            '--cocso-link-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Link = Object.assign(LinkComponent, {
  displayName: 'Link',
});
