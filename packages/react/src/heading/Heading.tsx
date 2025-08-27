import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { match } from 'ts-pattern';
import type { FontWeight, LineHeight, ResponsiveFontSize } from '../token';
import { Typography } from '../typography';

export type HeadingSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';

export interface HeadingProps extends ComponentPropsWithoutRef<'h2'> {
  asChild?: boolean;
  size?: HeadingSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ asChild, className, color, size = 'md', weight = 'bold', lineHeight, ...props }, ref) => {
    const Comp = asChild ? Slot : Primitive.h2;
    const fontSize = getFontSize(size);

    return (
      <Typography
        ref={ref}
        color={color}
        size={fontSize}
        weight={weight}
        lineHeight={lineHeight}
        asChild
      >
        <Comp {...props} />
      </Typography>
    );
  },
);

const getFontSize = (size: HeadingSize) => {
  return match(size)
    .with('xl', () => ({ base: 28, tablet: 40 }))
    .with('lg', () => ({ base: 24, tablet: 32 }))
    .with('md', () => ({ base: 22, tablet: 24 }))
    .with('sm', () => 18)
    .with('xs', () => 16)
    .with('2xs', () => 14)
    .exhaustive() as ResponsiveFontSize;
};
