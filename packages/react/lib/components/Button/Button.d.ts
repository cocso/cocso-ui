import * as React from 'react';
import { type FontWeightToken } from '../../utils/tokens';
declare const tags: readonly ["button"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];
export type ButtonProps<T extends Element = Default> = {
    as?: T;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    disabled?: boolean;
    loading?: boolean;
    color?: string;
    fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;
export declare const Button: (<T extends Element = "button">(props: ButtonProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
