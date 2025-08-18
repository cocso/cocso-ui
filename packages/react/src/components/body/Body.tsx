import { type ComponentProps, forwardRef } from 'react';
import { match } from 'ts-pattern';
import type { fontWeight as fontWeightToken, lineHeight as lineHeightToken } from '../token';
import { type ResponsiveFontSize, Typography } from '../typography';

type FontSize = 'lg' | 'md' | 'sm' | 'xs';

type FontWeight = keyof typeof fontWeightToken;

type LineHeight = keyof typeof lineHeightToken;

export interface BodyProps extends ComponentProps<'p'> {
  asChild?: boolean;
  color?: string;
  size?: FontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(
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
