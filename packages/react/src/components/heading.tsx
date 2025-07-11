import * as React from 'react';

export type HeadingProps<E extends React.ElementType> = {
  size?: 'lg' | 'md' | 'sm';
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<E>;

export const Heading = <E extends React.ElementType = 'h2'>({
  size = 'md',
  color = 'gray-90',
  children,
  className = '',
  ...props
}: HeadingProps<E>) => {
  const sizeClass = {
    lg: 'text-heading-l-mobile sm:text-heading-l',
    md: 'text-heading-m-mobile sm:text-heading-m',
    sm: 'text-heading-s-mobile sm:text-heading-s',
  }[size];
  const weightClass = 'font-bold';
  const textColorClass = '';

  return (
    <h2 className={`${sizeClass} ${weightClass} ${textColorClass} ${className}`} {...props}>
      {children}
    </h2>
  );
};
