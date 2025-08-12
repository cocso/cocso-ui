import { type ComponentProps, forwardRef } from 'react';
import type { fontWeight as fontWeightToken, lineHeight as lineHeightToken } from '../token';
import { Typography } from '../typography';

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

const getFontSize = (size: FontSize) => {
  switch (size) {
    case 'lg':
      return 18;
    case 'md':
      return 16;
    case 'sm':
      return 14;
    case 'xs':
      return 12;
  }
};
