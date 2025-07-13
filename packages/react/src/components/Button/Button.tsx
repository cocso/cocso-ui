import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
import { createClassName } from '../../utils/cn';
import { Spinner } from '../Spinner';

const tags = ['button'] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];

export type ButtonProps<T extends Element = Default> = {
  as?: T;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'text';
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;

const ButtonComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[0] as T,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      color,
      fontWeight = 'normal',
      className,
      style,
      children,
      onClick,
      onKeyDown,
      ...props
    }: ButtonProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;
    const isDisabled = disabled || loading;

    const spinnerSize = {
      '2xs': 'xs',
      xs: 'xs',
      sm: 'xs',
      md: 'sm',
      lg: 'md',
      xl: 'md',
    } as const;

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [isDisabled, onClick],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!isDisabled) {
            (event.currentTarget as HTMLButtonElement).click();
          }
        }
        onKeyDown?.(event);
      },
      [isDisabled, onKeyDown],
    );

    const variants = { variant, size, loading, disabled: isDisabled };

    const compoundVariants = [
      ...(disabled ? [{ variant, disabled }] : []),
      ...(loading ? [{ variant, loading }] : []),
    ];

    const combinedClassName = createClassName(
      'cocso-button',
      variants,
      compoundVariants,
      className,
    );

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        style={
          {
            '--cocso-button-color': createColor(color),
            '--cocso-button-weight': createFontWeight(fontWeight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {loading ? (
          <Spinner className="cocso-button-spinner" size={spinnerSize[size]} color="currentColor" />
        ) : (
          children
        )}
      </Element>
    );
  },
) as <T extends Element = Default>(
  props: ButtonProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Button = Object.assign(ButtonComponent, {
  displayName: 'Button',
});
