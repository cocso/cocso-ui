import * as React from 'react';
import { createColor } from '../../utils/tokens';
import { createClassName } from '../../utils/cn';

const tags = ['div'] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];

export type SpinnerProps<T extends Element = Default> = {
  as?: T;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  bg?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

const SpinnerComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[0] as T,
      size = 'md',
      color = 'palette.primary.500',
      bg = 'palette.gray.200',
      className,
      style,
      ...props
    }: SpinnerProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;

    const variants = { size };
    const combinedClassName = createClassName('cocso-spinner', variants, [], className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--cocso-spinner-bg': createColor(bg),
            '--cocso-spinner-color': createColor(color),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="9"
            stroke="var(--cocso-spinner-bg, currentColor)"
            strokeWidth="2"
          ></circle>
          <path
            className="opacity-75"
            fill="var(--cocso-spinner-color, currentColor)"
            d="M12 2a10 10 0 0110 10 10 10 0 01-5 8.66l-1-1.73a8 8 0 004-6.93 8 8 0 00-8-8V2z"
          ></path>
        </svg>
      </Element>
    );
  },
) as <T extends Element = Default>(
  props: SpinnerProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Spinner = Object.assign(SpinnerComponent, {
  displayName: 'Spinner',
});
