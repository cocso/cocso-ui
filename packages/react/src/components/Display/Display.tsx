import * as React from 'react';

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  return `var(--color-${color.replace('.', '-')})`;
}

type DisplayElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type DisplayProps<T extends DisplayElement = 'h1'> = {
  as?: T;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;

export const Display = React.forwardRef<
  React.ComponentRef<DisplayElement>,
  DisplayProps<DisplayElement>
>(({ as = 'h1', size = 'md', color = '', style, className, ...props }, ref) => {
  const Comp = as as React.ElementType;

  const combinedClassName = `text-display text-display-${size} ${className}`;

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

Display.displayName = 'Display';
