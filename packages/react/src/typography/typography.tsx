import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ReactElement, cloneElement, forwardRef, isValidElement } from 'react';
import { match } from 'ts-pattern';
import type { FontSize, FontWeight, LineHeight, ResponsiveFontSize } from '../token';
import {
  fontSize as fontSizeToken,
  fontWeight as fontWeightToken,
  lineHeight as lineHeightToken,
} from '../token';
import styles from './typography.module.css';

export type BodySize = 'lg' | 'md' | 'sm' | 'xs';
export type DisplaySize = 'lg' | 'md' | 'sm';
export type HeadingSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

type TypographyPropsBase = {
  render?: ReactElement;
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
      render: renderProp,
      className,
      style: _style,
      color,
      type = 'custom',
      weight = type === 'heading' ? 'bold' : 'normal',
      lineHeight = 'normal',
      ...props
    },
    ref
  ) => {
    const Comp = match(type)
      .with('display', () => 'h1' as const)
      .with('heading', () => 'h2' as const)
      .otherwise(() => 'p' as const);

    const fontSize = match(type)
      .with('custom', () => (props as CustomTypographyProps).size ?? 16)
      .with('body', () =>
        match((props as BodyTypographyProps).size ?? 'md')
          .with('lg', () => 18 as FontSize)
          .with('md', () => 16 as FontSize)
          .with('sm', () => 14 as FontSize)
          .with('xs', () => 12 as FontSize)
          .exhaustive()
      )
      .with('display', () =>
        match((props as DisplayTypographyProps).size ?? 'md')
          .with('lg', () => ({ base: 44 as FontSize, tablet: 60 as FontSize }))
          .with('md', () => ({ base: 32 as FontSize, tablet: 44 as FontSize }))
          .with('sm', () => ({ base: 28 as FontSize, tablet: 36 as FontSize }))
          .exhaustive()
      )
      .with('heading', () =>
        match((props as HeadingTypographyProps).size ?? 'md')
          .with('xl', () => ({ base: 28 as FontSize, tablet: 36 as FontSize }))
          .with('lg', () => ({ base: 24 as FontSize, tablet: 32 as FontSize }))
          .with('md', () => ({ base: 20 as FontSize, tablet: 24 as FontSize }))
          .with('sm', () => 18 as FontSize)
          .with('xs', () => 16 as FontSize)
          .exhaustive()
      )
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
    };

    const mergedClassName = cx(styles.typography, className);

    if (renderProp && isValidElement(renderProp)) {
      return cloneElement(renderProp, {
        // biome-ignore lint/suspicious/noExplicitAny: Polymorphic ref requires type assertion
        ...(ref && { ref: ref as any }),
        className: cx(mergedClassName, (renderProp.props as Record<string, unknown>).className as string | undefined),
        style: { ...style, ...((renderProp.props as Record<string, unknown>).style as Record<string, unknown> | undefined) },
        ...props,
      });
    }

    return (
      <Comp
        // biome-ignore lint/suspicious/noExplicitAny: Polymorphic component with multiple element types (h1, h2, p) requires type assertion for ref compatibility
        {...(ref && { ref: ref as any })}
        className={mergedClassName}
        style={style}
        {...props}
      />
    );
  }
);
