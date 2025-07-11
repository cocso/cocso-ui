import * as React from 'react';
import { createColor } from '../../utils/tokens';
import { cn } from '../../utils/cn';

type BodyElement =
  | 'p'
  | 'a'
  | 'span'
  | 'div'
  | 'label'
  | 'li'
  | 'td'
  | 'th'
  | 'figcaption'
  | 'blockquote'
  | 'cite';

export type BodyProps<T extends BodyElement = 'p'> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  fontWeight?: 'normal' | 'bold';
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;

export const Body = React.forwardRef<React.ComponentRef<BodyElement>, BodyProps<BodyElement>>(
  ({ as = 'p', size = 'md', color, fontWeight = 'normal', className, style, ...props }, ref) => {
    const Element = as as React.ElementType;
    const combinedClassName = cn(
      'text-body',
      `text-body-${size}${fontWeight === 'bold' ? '-bold' : ''}`,
      className,
    );

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
);

Body.displayName = 'Body';
