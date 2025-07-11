import * as React from 'react';

export type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  color?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  return `var(--color-${color.replace('.', '-')})`;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', size = 'md', color = '', style, className, ...props }, ref) => {
    const Comp = as || 'h2';

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
  },
);

Heading.displayName = `Heading`;
