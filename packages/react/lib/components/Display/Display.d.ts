import * as React from 'react';
type DisplayElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type DisplayProps<T extends DisplayElement = 'h1'> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm';
    color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;
export declare const Display: React.ForwardRefExoticComponent<{
    as?: DisplayElement | undefined;
    size?: "lg" | "md" | "sm";
    color?: string;
} & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref">, "size" | "color"> & React.RefAttributes<HTMLHeadingElement>>;
export {};
