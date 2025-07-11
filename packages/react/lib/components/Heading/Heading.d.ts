import * as React from 'react';
export type HeadingProps = {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    color?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;
export declare const Heading: React.ForwardRefExoticComponent<{
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
    color?: string;
} & React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
