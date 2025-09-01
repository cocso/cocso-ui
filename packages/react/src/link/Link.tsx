import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { FontWeight, LineHeight } from '../token';
import { Typography } from '../typography';
import styles from './Link.module.css';

export type LinkSize = 'lg' | 'md' | 'sm' | 'xs';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
  size?: LinkSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
  indicator?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild, className, size, weight, lineHeight, indicator = true, ...props }, ref) => {
    const Comp = asChild ? Slot : Primitive.a;

    return (
      <Typography type="body" size={size} weight={weight} lineHeight={lineHeight} asChild>
        <Comp
          ref={ref}
          className={cx(styles.link, indicator && styles.indicator, className)}
          {...props}
        />
      </Typography>
    );
  },
);
