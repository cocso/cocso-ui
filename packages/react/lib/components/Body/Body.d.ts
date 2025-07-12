import * as React from 'react';
import { type FontWeightToken } from '../../utils/tokens';
declare const tags: readonly ["p", "a", "span", "div", "label", "li", "td", "th", "figcaption", "blockquote", "cite"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];
export type BodyProps<T extends Element = Default> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;
export declare const Body: (<T extends Element = "p">(props: BodyProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
