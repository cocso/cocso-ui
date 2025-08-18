import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { createClassName } from '../../utils/cn';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { Spinner } from '../spinner';

export type ButtonProps = {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'text';
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'button'>;

const getSpinnerSize = (buttonSize: ButtonProps['size']): 'xl' | 'lg' | 'md' | 'sm' | 'xs' => {
  const sizeMap = {
    '2xs': 'xs',
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'md',
  } as const;
  return sizeMap[buttonSize!];
};

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      color,
      weight = 'normal',
      className,
      style,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const isButtonDisabled = disabled || loading;

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isButtonDisabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [isButtonDisabled, onClick],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const isEnterOrSpace = event.key === 'Enter' || event.key === ' ';

        if (isEnterOrSpace) {
          event.preventDefault();
          if (!isButtonDisabled) {
            (event.currentTarget as HTMLButtonElement).click();
          }
        }
        onKeyDown?.(event);
      },
      [isButtonDisabled, onKeyDown],
    );

    const variants = { variant, size, loading, disabled: isButtonDisabled };
    const compoundVariants = [
      ...(disabled ? [{ variant, disabled }] : []),
      ...(loading ? [{ variant, loading }] : []),
    ];
    const classNames = createClassName('cocso-button', variants, compoundVariants, className);

    const buttonStyle = {
      '--cocso-button-color': createColor(color),
      '--cocso-button-weight': createFontWeight(weight),
      ...style,
    } as React.CSSProperties;

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={classNames}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
        aria-busy={loading}
        style={buttonStyle}
        {...props}
      >
        {loading ? (
          <Spinner
            className="cocso-button-spinner"
            size={getSpinnerSize(size)}
            color="currentColor"
          />
        ) : (
          children
        )}
      </Comp>
    );
  },
);

export const Button = Object.assign(ButtonComponent, {
  displayName: 'Button',
});
