import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { clsx as cx } from 'clsx';
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  forwardRef,
} from 'react';
import { match } from 'ts-pattern';
import type { FontSize, FontWeight, LineHeight, ResponsiveFontSize } from '../token';
import {
  fontSize as fontSizeToken,
  fontWeight as fontWeightToken,
  lineHeight as lineHeightToken,
} from '../token';
import styles from './Typography.module.css';

export type BodySize = 'lg' | 'md' | 'sm' | 'xs';
export type DisplaySize = 'lg' | 'md' | 'sm';
export type HeadingSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

type TypographyPropsBase = {
  asChild?: boolean;
  weight?: FontWeight;
  lineHeight?: LineHeight;
} & ComponentPropsWithoutRef<'p'>;

type CustomTypographyProps = TypographyPropsBase & {
  type?: 'custom';
  size?: ResponsiveFontSize;
};

type BodyTypographyProps = TypographyPropsBase & {
  type: 'body';
  size?: BodySize;
};

type DisplayTypographyProps = TypographyPropsBase & {
  type: 'display';
  size?: DisplaySize;
};

type HeadingTypographyProps = TypographyPropsBase & {
  type: 'heading';
  size?: HeadingSize;
};

export type TypographyProps =
  | CustomTypographyProps
  | BodyTypographyProps
  | DisplayTypographyProps
  | HeadingTypographyProps;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      asChild,
      className,
      style: _style,
      color,
      type = 'custom',
      weight = type === 'heading' ? 'bold' : 'normal',
      lineHeight = 'normal',
      ...props
    },
    ref,
  ) => {
    const Comp = match({ asChild, type })
      .with({ asChild: true }, () => Slot)
      .with({ type: 'display' }, () => 'h1' as const)
      .with({ type: 'heading' }, () => Primitive.h2)
      .with({ type: 'body' }, () => Primitive.p)
      .with({ type: 'custom' }, () => Primitive.p)
      .otherwise(() => Primitive.p) as ElementType;

    const fontSize = match(type)
      .with('custom', () => (props as CustomTypographyProps).size ?? 16)
      .with('body', () => getBodyFontSize((props as BodyTypographyProps).size ?? 'md'))
      .with('display', () => getDisplayFontSize((props as DisplayTypographyProps).size ?? 'md'))
      .with('heading', () => getHeadingFontSize((props as HeadingTypographyProps).size ?? 'md'))
      .otherwise(() => 16);

    let base: FontSize;
    let tablet: FontSize | undefined;
    let desktop: FontSize | undefined;

    if (Array.isArray(fontSize)) {
      [base, tablet, desktop] = fontSize;
    } else if (typeof fontSize === 'object') {
      ({ base, tablet, desktop } = fontSize);
    } else {
      base = fontSize as FontSize;
    }

    const style = {
      ..._style,
      '--cocso-typography-font-color': color,
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

const getBodyFontSize = (size: BodySize): ResponsiveFontSize => {
  return match(size)
    .with('lg', () => 18 as const)
    .with('md', () => 16 as const)
    .with('sm', () => 14 as const)
    .with('xs', () => 12 as const)
    .exhaustive();
};

const getDisplayFontSize = (size: DisplaySize): ResponsiveFontSize => {
  return match(size)
    .with('lg', () => ({ base: 44, tablet: 60 }) as const)
    .with('md', () => ({ base: 32, tablet: 44 }) as const)
    .with('sm', () => ({ base: 28, tablet: 36 }) as const)
    .exhaustive();
};

const getHeadingFontSize = (size: HeadingSize): ResponsiveFontSize => {
  return match(size)
    .with('xl', () => ({ base: 28, tablet: 36 }) as const)
    .with('lg', () => ({ base: 24, tablet: 32 }) as const)
    .with('md', () => ({ base: 20, tablet: 24 }) as const)
    .with('sm', () => 18 as const)
    .with('xs', () => 16 as const)
    .exhaustive();
};
