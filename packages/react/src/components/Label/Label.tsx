import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

const tags = [
  'label',
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

export type LabelProps<T extends Element = Default> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<T>;

const LabelComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[0] as T,
      size = 'md',
      color,
      weight = 'normal',
      className,
      style,
      ...props
    }: LabelProps<T>,
    ref?: React.ComponentPropsWithRef<T>['ref'],
  ) => {
    const Element = as as React.ElementType;

    const variants = { size };
    const combinedClassName = createClassName('cocso-label', variants, [], className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--cocso-label-color': createColor(color),
            '--cocso-label-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Label = Object.assign(LabelComponent, {
  displayName: 'Label',
});
