import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps, forwardRef } from 'react';
import { match } from 'ts-pattern';
import type { fontWeight as fontWeightToken, lineHeight as lineHeightToken } from '../token';
import { type ResponsiveFontSize, Typography } from '../typography';

type FontSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';

type FontWeight = keyof typeof fontWeightToken;

type LineHeight = keyof typeof lineHeightToken;

export interface HeadingProps extends ComponentProps<'h2'> {
  asChild?: boolean;
  size?: FontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ asChild, className, color, size = 'md', weight = 'bold', lineHeight, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h2';
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
    .with('xl', () => ({ base: 28, tablet: 40 }))
    .with('lg', () => ({ base: 24, tablet: 32 }))
    .with('md', () => ({ base: 22, tablet: 24 }))
    .with('sm', () => 18)
    .with('xs', () => 16)
    .with('2xs', () => 14)
    .exhaustive() as ResponsiveFontSize;
};
