import { Slot } from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { match } from 'ts-pattern';
import type { FontWeight, LineHeight, ResponsiveFontSize } from '../token';
import { Typography } from '../typography';

export type DisplaySize = 'large' | 'medium' | 'small';

export interface DisplayProps extends ComponentPropsWithoutRef<'h1'> {
  asChild?: boolean;
  color?: string;
  size?: DisplaySize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ asChild, className, color, size = 'medium', weight, lineHeight, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h1';
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

const getFontSize = (size: DisplaySize) => {
  return match(size)
    .with('large', () => ({ base: 44, tablet: 60 }))
    .with('medium', () => ({ base: 32, tablet: 44 }))
    .with('small', () => ({ base: 28, tablet: 36 }))
    .exhaustive() as ResponsiveFontSize;
};
