import * as React from 'react';
export type DisplayProps = {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'lg' | 'md' | 'sm';
    color?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;
export declare const Display: React.ForwardRefExoticComponent<{
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: "lg" | "md" | "sm";
    color?: string;
} & React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
