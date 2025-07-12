import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
import { createClassName } from '../../utils/cn';

const tags = ['button'] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];

export type ButtonProps<T extends Element = Default> = {
  as?: T;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
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
      fontWeight = 'bold',
      className,
      style,
      ...props
    }: ButtonProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;

    const variants = {
      variant,
      size,
      ...(disabled && { disabled: 'true' }),
      ...(loading && { loading: 'true' }),
    };

    const combinedClassName = createClassName('cocso-button', variants, [], className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
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
