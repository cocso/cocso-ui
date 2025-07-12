import * as React from 'react';
import { type FontWeightToken } from '../../utils/tokens';
declare const tags: readonly ["h1", "h2", "h3", "h4", "h5", "h6"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[1];
export type HeadingProps<T extends Element = Default> = {
    as?: T;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    color?: string;
    fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;
export declare const Heading: (<T extends Element = "h2">(props: HeadingProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
