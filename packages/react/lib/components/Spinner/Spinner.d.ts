import * as React from 'react';
declare const tags: readonly ["div"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];
export type SpinnerProps<T extends Element = Default> = {
    as?: T;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    bg?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;
export declare const Spinner: (<T extends Element = "div">(props: SpinnerProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
