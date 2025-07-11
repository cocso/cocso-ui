import * as React from 'react';

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  return `var(--color-${color.replace('.', '-')})`;
}

type BodyElement =
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'li'
  | 'td'
  | 'th'
  | 'figcaption'
  | 'blockquote'
  | 'cite';

export interface BodyProps<T extends React.ElementType = 'p'> {
  as?: T & BodyElement;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: string;
  fontWeight?: 'normal' | 'bold';
}

export type BodyPropsWithElement<T extends React.ElementType = 'p'> = BodyProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BodyProps<T>>;

export const Body = React.forwardRef<HTMLElement, BodyPropsWithElement<BodyElement>>(
  (
    { as = 'p', size = 'md', color = '', fontWeight = 'normal', style, className, ...props },
    ref,
  ) => {
    const Comp = as as React.ElementType;

    const combinedClassName = `text-body text-body-${size}${fontWeight === 'bold' ? '-bold' : ''} ${className}`;

    return (
      <Comp
        ref={ref}
        className={combinedClassName}
        style={
          {
            '--text-color': handleColor(color),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

Body.displayName = 'Body';
