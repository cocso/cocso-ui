import * as React from 'react';

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  return `var(--color-${color.replace('.', '-')})`;
}

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps<T extends HeadingElement = 'h2'> = {
  as?: T;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

export const Heading = React.forwardRef<
  React.ComponentRef<HeadingElement>,
  HeadingProps<HeadingElement>
>(({ as = 'h2', size = 'md', color = '', style, className, ...props }, ref) => {
  const Comp = as as React.ElementType;

  const combinedClassName = `text-heading text-heading-${size} ${className}`;

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
});

Heading.displayName = 'Heading';
