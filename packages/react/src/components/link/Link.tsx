import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { Body } from '../body';
import type { FontWeight, LineHeight } from '../typography';
import styles from './Link.module.css';

type LinkSize = 'lg' | 'md' | 'sm' | 'xs';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
  size?: LinkSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
  indicator?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild, className, style, size, weight, lineHeight, indicator = true, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <Body size={size} weight={weight} lineHeight={lineHeight} asChild>
        <Comp
          ref={ref}
          className={clsx(styles.link, indicator && styles.indicator, className)}
          style={style}
          {...props}
        >
          {props.children}
        </Comp>
      </Body>
    );
  },
);
