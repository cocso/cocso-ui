import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
declare const tags: readonly ["label"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];
export type Label<T extends Element = Default> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color'>;
export declare const Label: (<T extends Element = "label">(props: Label<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
