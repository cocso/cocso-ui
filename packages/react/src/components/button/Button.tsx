import { Slot } from '@radix-ui/react-slot';
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  type ReactNode,
} from 'react';
import { match } from 'ts-pattern';
import type { FontWeight } from '../typography';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning';

export type ButtonShape = 'square' | 'circle' | 'rounded';

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'prefix'> {
  asChild?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
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
      asChild,
      className,
      style: _style,
      children,
      size = 'medium',
      type = 'primary',
      weight = 'normal',
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
    } as CSSProperties;

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp ref={ref} aria-busy={loading} style={style} {...props}>
        {children}
      </Comp>
    );
  },
);

const getSizeStyles = (size: ButtonSize) => {
  const height = match(size)
    .with('small', () => 32)
    .with('medium', () => 40)
    .with('large', () => 48)
    .exhaustive();
  const inlinePadding = match(size)
    .with('small', () => 6)
    .with('medium', () => 10)
    .with('large', () => 14)
    .exhaustive();
  const fontSize = match(size)
    .with('small', 'medium', () => 14)
    .with('large', () => 16)
    .exhaustive();
  const borderRadius = match(size)
    .with('small', 'medium', () => 6)
    .with('large', () => 8);

  return {
    '--cocso-button-height': `${height}px`,
    '--cocso-button-padding-inline': `${inlinePadding}px`,
    '--cocso-button-font-size': `${fontSize}px`,
    '--cocso-button-border-radius': `${borderRadius}px`,
  };
};
