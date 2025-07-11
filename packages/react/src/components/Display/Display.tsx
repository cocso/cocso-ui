import * as React from 'react';
import { createColor } from '../../utils/tokens';
import { cn } from '../../utils/cn';

type DisplayElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type DisplayProps<T extends DisplayElement = 'h1'> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

const DisplayComponent = React.forwardRef(
  <T extends DisplayElement = 'h1'>(
    { as = 'h1' as T, size = 'md', color, className, style, ...props }: DisplayProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;
    const combinedClassName = cn('text-display', `text-display-${size}`, className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--text-color': createColor(color),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
) as <T extends DisplayElement = 'h1'>(
  props: DisplayProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Display = Object.assign(DisplayComponent, {
  displayName: 'Display',
});
