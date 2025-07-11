import * as React from 'react';

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  return `var(--color-${color.replace('.', '-')})`;
}

export type DisplayProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'lg' | 'md' | 'sm';
  color?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

export const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ as = 'h1', size = 'md', color = '', style, className, ...props }, ref) => {
    const Comp = as;

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
  },
);

Display.displayName = `Display`;
