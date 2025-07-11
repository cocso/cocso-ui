import * as React from 'react';
export type HeadingProps<E extends React.ElementType> = {
    size?: 'lg' | 'md' | 'sm';
    color?: string;
    children: React.ReactNode;
    className?: string;
} & React.ComponentPropsWithoutRef<E>;
export declare const Heading: <E extends React.ElementType = "h2">({ size, color, children, className, ...props }: HeadingProps<E>) => import("react/jsx-runtime").JSX.Element;
