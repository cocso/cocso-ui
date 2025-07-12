import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/tokens';
import { createClassName } from '../../utils/cn';

const tags = [
  'p',
  'a',
  'span',
  'div',
  'label',
  'li',
  'td',
  'th',
  'figcaption',
  'blockquote',
  'cite',
] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];

export type BodyProps<T extends Element = Default> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;

const BodyComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[0] as T,
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

    const variants = { size };
    const combinedClassName = createClassName('cocso-body', variants, [], className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--cocso-body-color': createColor(color),
            '--cocso-body-weight': createFontWeight(fontWeight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
) as <T extends Element = Default>(
  props: BodyProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Body = Object.assign(BodyComponent, {
  displayName: 'Body',
});
