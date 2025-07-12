import * as React from 'react';
import { type FontWeightToken } from '../../utils/tokens';
declare const tags: readonly ["h1", "h2", "h3", "h4", "h5", "h6"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];
export type DisplayProps<T extends Element = Default> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm';
    color?: string;
    fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;
export declare const Display: (<T extends Element = "h1">(props: DisplayProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
