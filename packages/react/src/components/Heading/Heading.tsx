import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
import { cn } from '../../utils/cn';

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps<T extends HeadingElement = 'h2'> = {
  as?: T;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  color?: string;
  fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

const HeadingComponent = React.forwardRef(
  <T extends HeadingElement = 'h2'>(
    {
      as = 'h2' as T,
      size = 'md',
      color,
      fontWeight = 'bold',
      className,
      style,
      ...props
    }: HeadingProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;
    const combinedClassName = cn('text-heading', `text-heading-${size}`, className);

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
) as <T extends HeadingElement = 'h2'>(
  props: HeadingProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Heading = Object.assign(HeadingComponent, {
  displayName: 'Heading',
});
