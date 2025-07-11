import * as React from 'react';
type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingProps<T extends HeadingElement = 'h2'> = {
    as?: T;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;
export declare const Heading: (<T extends HeadingElement = "h2">(props: HeadingProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
