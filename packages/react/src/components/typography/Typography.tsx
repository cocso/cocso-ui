import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps, type CSSProperties, forwardRef } from 'react';
import { cn, createColor } from '../../utils';
import {
  fontSize as fontSizeToken,
  fontWeight as fontWeightToken,
  lineHeight as lineHeightToken,
} from '../token';
import styles from './Typography.module.css';

export type FontSizeType = keyof typeof fontSizeToken;

export type FontSize =
  | FontSizeType
  | [FontSizeType, FontSizeType?, FontSizeType?]
  | { base: FontSizeType; tablet?: FontSizeType; desktop?: FontSizeType };

export type FontWeight = keyof typeof fontWeightToken;

export type LineHeight = keyof typeof lineHeightToken;

export interface TypographyProps extends ComponentProps<'p'> {
  asChild?: boolean;
  size?: FontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
  (
    {
      asChild,
      className,
      color,
      size = 16,
      weight = 'regular',
      lineHeight = 'normal',
      style: _style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'p';

    let base: FontSizeType | undefined;
    let tablet: FontSizeType | undefined;
    let desktop: FontSizeType | undefined;

    if (Array.isArray(size)) {
      [base, tablet, desktop] = size;
    } else if (typeof size === 'object') {
      ({ base, tablet, desktop } = size);
    } else {
      base = size;
    }

    const style = {
      ..._style,
      '--cocso-typography-font-color': createColor(color),
      '--cocso-typography-font-size': `${fontSizeToken[base]}px`,
      ...(tablet !== undefined && {
        '--cocso-tablet-typography-font-size': `${fontSizeToken[tablet]}px`,
      }),
      ...(desktop !== undefined && {
        '--cocso-desktop-typography-font-size': `${fontSizeToken[desktop]}px`,
      }),
      '--cocso-typography-font-weight': fontWeightToken[weight],
      '--cocso-typography-line-height': lineHeightToken[lineHeight],
    } as CSSProperties;

    return <Comp ref={ref} className={cn(styles.typography, className)} style={style} {...props} />;
  },
);
