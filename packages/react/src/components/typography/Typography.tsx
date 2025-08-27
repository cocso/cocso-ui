import { Slot } from '@radix-ui/react-slot';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from 'react';
import { createColor } from '../../utils';
import {
  fontSize as fontSizeToken,
  fontWeight as fontWeightToken,
  lineHeight as lineHeightToken,
} from '../token';
import styles from './Typography.module.css';

export type FontSize = keyof typeof fontSizeToken;

export type ResponsiveFontSize =
  | FontSize
  | [FontSize, FontSize?, FontSize?]
  | { base: FontSize; tablet?: FontSize; desktop?: FontSize };

export type FontWeight = keyof typeof fontWeightToken;

export type LineHeight = keyof typeof lineHeightToken;

export interface TypographyProps extends ComponentPropsWithoutRef<'p'> {
  asChild?: boolean;
  size?: ResponsiveFontSize;
  weight?: FontWeight;
  lineHeight?: LineHeight;
}

export const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
  (
    {
      asChild,
      className,
      style: _style,
      color,
      size = 16,
      weight = 'normal',
      lineHeight = 'normal',
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'p';

    let base: FontSize | undefined;
    let tablet: FontSize | undefined;
    let desktop: FontSize | undefined;

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

    return <Comp ref={ref} className={cx(styles.typography, className)} style={style} {...props} />;
  },
);
