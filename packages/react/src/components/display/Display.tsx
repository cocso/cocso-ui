import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps, forwardRef } from 'react';
import { match } from 'ts-pattern';
import type { fontWeight as fontWeightToken, lineHeight as lineHeightToken } from '../token';
import { type ResponsiveFontSize, Typography } from '../typography';

type FontSize = 'lg' | 'md' | 'sm';

type FontWeight = keyof typeof fontWeightToken;

type LineHeight = keyof typeof lineHeightToken;

export interface DisplayProps extends ComponentProps<'h1'> {
  asChild?: boolean;
  color?: string;
  size?: FontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(
  (
    {
      asChild,
      className,
      color,
      size = 'md',
      weight = 'regular',
      lineHeight = 'normal',
      style: _style,
      ...props
    },
    ref,
  ) => {
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

const getFontSize = (size: FontSize) => {
  return match(size)
    .with('lg', () => ({ base: 44, tablet: 60 }))
    .with('md', () => ({ base: 32, tablet: 44 }))
    .with('sm', () => ({ base: 28, tablet: 36 }))
    .exhaustive() as ResponsiveFontSize;
};
