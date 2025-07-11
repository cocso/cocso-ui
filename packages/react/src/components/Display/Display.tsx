import * as React from 'react';
import { createColor } from '../../utils/tokens';
import { cn } from '../../utils/cn';

type DisplayElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type DisplayProps<T extends DisplayElement = 'h1'> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

export const Display = React.forwardRef<
  React.ComponentRef<DisplayElement>,
  DisplayProps<DisplayElement>
>(({ as = 'h1', size = 'md', color, className, style, ...props }, ref) => {
  const Comp = as as React.ElementType;
  const combinedClassName = cn('text-display', `text-display-${size}`, className);

  return (
    <Comp
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
});

Display.displayName = 'Display';
