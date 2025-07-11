import * as React from 'react';
type DisplayElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type DisplayProps<T extends DisplayElement = 'h1'> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm';
    color?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;
export declare const Display: (<T extends DisplayElement = "h1">(props: DisplayProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
