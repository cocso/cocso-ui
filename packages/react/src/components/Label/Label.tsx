import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

const tags = ['label'] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];

export type Label<T extends Element = Default> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  weight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

const LabelComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[0] as T,
      size = 'md',
      weight = 'normal',
      color,
      className,
      style,
      children,
      ...props
    }: Label<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
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
      >
        {children}
      </Element>
    );
  },
) as <T extends Element = Default>(
  props: Label<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => React.ReactElement;

export const Label = Object.assign(LabelComponent, {
  displayName: 'Label',
});
