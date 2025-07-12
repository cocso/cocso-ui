import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
import { createClassName } from '../../utils/cn';

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];

export type DisplayProps<T extends Element = Default> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
  fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;

const DisplayComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[0] as T,
      size = 'md',
      color,
      fontWeight = 'bold',
      className,
      style,
      ...props
    }: DisplayProps<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) => {
    const Element = as as React.ElementType;

    const variants = { size };
    const combinedClassName = createClassName('cocso-display', variants, [], className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--cocso-display-color': createColor(color),
            '--cocso-display-weight': createFontWeight(fontWeight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
) as <T extends Element = Default>(
  props: DisplayProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Display = Object.assign(DisplayComponent, {
  displayName: 'Display',
});
