import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
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
  fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;

const BodyComponent = React.forwardRef(
  <T extends BodyElement = 'p'>(
    {
      as = 'p' as T,
      size = 'md',
      color,
      fontWeight = 'normal',
      className,
      style,
      ...props
    }: BodyProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;
    const combinedClassName = cn('text-body', `text-body-${size}`, className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--font-color': createColor(color),
            '--font-weight': createFontWeight(fontWeight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
) as <T extends BodyElement = 'p'>(
  props: BodyProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Body = Object.assign(BodyComponent, {
  displayName: 'Body',
});
