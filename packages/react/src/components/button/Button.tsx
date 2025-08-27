import { Primitive } from '@radix-ui/react-primitive';
import { clsx as cx } from 'clsx';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { forwardRef } from 'react';
import { match } from 'ts-pattern';
import { Spinner } from '../spinner';
import { colors, fontWeight } from '../token';
import type { FontWeight } from '../typography';
import styles from './Button.module.css';

export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'error'
  | 'warning'
  | 'neutral';

export type ButtonShape = 'square' | 'circle' | 'rounded';

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'prefix'> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  weight?: FontWeight;
  shape?: ButtonShape;
  prefix?: ReactNode;
  suffix?: ReactNode;
  svgOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      style: _style,
      children,
      size = 'medium',
      variant = 'primary',
      weight = 'medium',
      shape = 'square',
      prefix,
      suffix,
      svgOnly = false,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const style = {
      ..._style,
      ...getSizeStyles(size),
      '--cocso-button-font-color': getColor(variant),
      '--cocso-button-font-weight': fontWeight[weight],
      '--cocso-button-border': getBorder(variant),
      '--cocso-button-border-radius': getBorderRadius(shape, size),
      '--cocso-button-bg-color': getBackgroundColor(variant),
      '--cocso-button-bg-color-hover': getBackgroundColorHover(variant),
      '--cocso-button-bg-color-active': getBackgroundColorActive(variant),
    } as CSSProperties;

    const isDisabled = disabled || loading;

    return (
      <Primitive.button
        ref={ref}
        className={cx(
          styles.button,
          isDisabled && styles.disabled,
          svgOnly && styles.svgOnly,
          className,
        )}
        disabled={isDisabled}
        style={style}
        {...props}
      >
        {loading && <Spinner size="small" color="white" />}
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.content}>{children}</span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </Primitive.button>
    );
  },
);

const getSizeStyles = (size: ButtonSize) => {
  const height = match(size)
    .with('tiny', () => 24)
    .with('small', () => 32)
    .with('medium', () => 40)
    .with('large', () => 48)
    .exhaustive();
  const inlinePadding = match(size)
    .with('tiny', () => 0)
    .with('small', () => 6)
    .with('medium', () => 10)
    .with('large', () => 14)
    .exhaustive();
  const fontSize = match(size)
    .with('tiny', () => 12)
    .with('large', () => 16)
    .otherwise(() => 14);

  return {
    '--cocso-button-height': `${height}px`,
    '--cocso-button-padding-inline': `${inlinePadding}px`,
    '--cocso-button-font-size': `${fontSize}px`,
  };
};

const getBorderRadius = (shape: ButtonShape, size: ButtonSize) => {
  return match(shape)
    .with('square', () => {
      return match(size)
        .with('tiny', () => '4px')
        .with('small', () => '6px')
        .with('medium', () => '6px')
        .with('large', () => '8px')
        .exhaustive();
    })
    .with('circle', () => '100%')
    .with('rounded', () => '100px')
    .exhaustive();
};

const getColor = (variant: ButtonVariant) => {
  return match(variant)
    .with('primary', 'success', 'error', 'neutral', () => colors.white)
    .with('secondary', 'tertiary', 'warning', () => colors.neutral950)
    .exhaustive();
};

const getBorder = (variant: ButtonVariant) => {
  return match(variant)
    .with('tertiary', () => `1px solid ${colors.neutral100}`)
    .otherwise(() => 'none');
};

const getBackgroundColor = (variant: ButtonVariant) => {
  return match(variant)
    .with('primary', () => colors.primary500)
    .with('secondary', () => colors.white)
    .with('tertiary', () => colors.transparent)
    .with('success', () => colors.success500)
    .with('error', () => colors.danger500)
    .with('warning', () => colors.warning300)
    .with('neutral', () => colors.neutral950)
    .exhaustive();
};

const getBackgroundColorHover = (variant: ButtonVariant) => {
  return match(variant)
    .with('primary', () => colors.primary600)
    .with('secondary', () => colors.neutral50)
    .with('tertiary', () => colors.neutral50)
    .with('success', () => colors.success600)
    .with('error', () => colors.danger600)
    .with('warning', () => colors.warning400)
    .with('neutral', () => colors.neutral800)
    .exhaustive();
};

const getBackgroundColorActive = (variant: ButtonVariant) => {
  return match(variant)
    .with('primary', () => colors.primary700)
    .with('secondary', () => colors.neutral100)
    .with('tertiary', () => colors.neutral100)
    .with('success', () => colors.success700)
    .with('error', () => colors.danger700)
    .with('warning', () => colors.warning500)
    .with('neutral', () => colors.neutral700)
    .exhaustive();
};
