import * as React from 'react';
type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingProps<T extends HeadingElement = 'h2'> = {
    as?: T;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;
export declare const Heading: React.ForwardRefExoticComponent<{
    as?: HeadingElement | undefined;
    size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
    color?: string;
} & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref">, "size" | "color"> & React.RefAttributes<HTMLHeadingElement>>;
export {};
