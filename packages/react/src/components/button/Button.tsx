import { Slot } from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from 'react';
import { match } from 'ts-pattern';
import type { FontWeight } from '../typography';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonType = 'secondary' | 'tertiary' | 'error' | 'warning';

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'text';
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonType;
  weight?: FontWeight;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      style: _style,
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      weight = 'normal',
      type = 'secondary',
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
