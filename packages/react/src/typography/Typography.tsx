import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from 'react';
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

export const Typography = forwardRef<HTMLElement, TypographyProps>((allProps, ref) => {
  const {
    asChild,
    className,
    style: _style,
    color,
    type = 'custom',
    weight = type === 'heading' ? 'bold' : 'normal',
    lineHeight = 'normal',
    ...props
  } = allProps;

  const Comp = match({ asChild, type })
    .with({ asChild: true }, () => Slot)
    .with({ type: 'display' }, () => 'h1')
    .with({ type: 'heading' }, () => Primitive.h2)
    .with({ type: 'body' }, () => Primitive.p)
    .with({ type: 'custom' }, () => Primitive.p)
    .otherwise(() => Primitive.p);

  const fontSize = getFontSizeForType(allProps);

  let base: FontSize | undefined;
  let tablet: FontSize | undefined;
  let desktop: FontSize | undefined;

  if (Array.isArray(fontSize)) {
    [base, tablet, desktop] = fontSize;
  } else if (typeof fontSize === 'object') {
    ({ base, tablet, desktop } = fontSize);
  } else {
    base = fontSize;
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

  return (
    <Comp ref={ref as any} className={cx(styles.typography, className)} style={style} {...props} />
  );
});

const getFontSizeForType = (props: TypographyProps): ResponsiveFontSize => {
  const type = props.type || 'custom';

  if (type === 'custom') {
    return (props as CustomTypographyProps).size || 16;
  }

  if (type === 'body') {
    return getBodyFontSize((props as BodyTypographyProps).size || 'md');
  }

  if (type === 'display') {
    return getDisplayFontSize((props as DisplayTypographyProps).size || 'md');
  }

  if (type === 'heading') {
    return getHeadingFontSize((props as HeadingTypographyProps).size || 'md');
  }

  return 16;
};

const getBodyFontSize = (size: BodySize): ResponsiveFontSize => {
  return match(size)
    .with('lg', () => 18)
    .with('md', () => 16)
    .with('sm', () => 14)
    .with('xs', () => 12)
    .exhaustive() as ResponsiveFontSize;
};

const getDisplayFontSize = (size: DisplaySize): ResponsiveFontSize => {
  return match(size)
    .with('lg', () => ({ base: 44, tablet: 60 }))
    .with('md', () => ({ base: 32, tablet: 44 }))
    .with('sm', () => ({ base: 28, tablet: 36 }))
    .exhaustive() as ResponsiveFontSize;
};

const getHeadingFontSize = (size: HeadingSize): ResponsiveFontSize => {
  return match(size)
    .with('xl', () => ({ base: 28, tablet: 40 }))
    .with('lg', () => ({ base: 24, tablet: 32 }))
    .with('md', () => ({ base: 22, tablet: 24 }))
    .with('sm', () => 18)
    .with('xs', () => 16)
    .exhaustive() as ResponsiveFontSize;
};
