import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
import { createClassName } from '../../utils/cn';

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
      ...props
    }: ButtonProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!disabled) {
          (event.currentTarget as HTMLButtonElement).click();
        }
      }
    };

    const variants = { variant, size, loading, disabled };

    const compoundVariants = [...(disabled ? [{ variant, disabled }] : [])];

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
        onKeyDown={handleKeyDown}
        role="button"
        disabled={disabled}
        style={
          {
            '--cocso-button-color': createColor(color),
            '--cocso-button-weight': createFontWeight(fontWeight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
) as <T extends Element = Default>(
  props: ButtonProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Button = Object.assign(ButtonComponent, {
  displayName: 'Button',
});
