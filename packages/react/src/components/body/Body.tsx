import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { match } from 'ts-pattern';
import {
  type FontWeight,
  type LineHeight,
  type ResponsiveFontSize,
  Typography,
} from '../typography';

type FontSize = 'lg' | 'md' | 'sm' | 'xs';

export interface BodyProps extends ComponentPropsWithoutRef<'p'> {
  asChild?: boolean;
  color?: string;
  size?: FontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(
  (
    { asChild, className, style: _style, color, size = 'md', weight, lineHeight, ...props },
    ref,
  ) => {
    const fontSize = getFontSize(size);

    return (
      <Typography
        ref={ref}
        color={color}
        size={fontSize}
        weight={weight}
        lineHeight={lineHeight}
        asChild={asChild}
        {...props}
      />
    );
  },
);

const getFontSize = (size: FontSize): ResponsiveFontSize => {
  return match(size)
    .with('lg', () => 18)
    .with('md', () => 16)
    .with('sm', () => 14)
    .with('xs', () => 12)
    .exhaustive() as ResponsiveFontSize;
};
