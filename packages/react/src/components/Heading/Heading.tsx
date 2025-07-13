import * as React from 'react';
import { createColor, createFontWeight, type FontWeightToken } from '../../utils/token';
import { createClassName } from '../../utils/cn';

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type Element = (typeof tags)[number];
type Default = (typeof tags)[1];

export type HeadingProps<T extends Element = Default> = {
  as?: T;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  color?: string;
  weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<T>;

const HeadingComponent = React.forwardRef(
  <T extends Element = Default>(
    {
      as = tags[1] as T,
      size = 'md',
      color,
      weight = 'bold',
      className,
      style,
      ...props
    }: HeadingProps<T>,
    ref?: React.ComponentPropsWithRef<T>['ref'],
  ) => {
    const Element = as as React.ElementType;

    const variants = { size };
    const combinedClassName = createClassName('cocso-heading', variants, [], className);

    return (
      <Element
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--cocso-heading-color': createColor(color),
            '--cocso-heading-weight': createFontWeight(weight),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

export const Heading = Object.assign(HeadingComponent, {
  displayName: 'Heading',
});
