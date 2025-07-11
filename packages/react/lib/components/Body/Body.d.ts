import * as React from 'react';
import { type FontWeightToken } from '../../utils/tokens';
type BodyElement = 'p' | 'a' | 'span' | 'div' | 'label' | 'li' | 'td' | 'th' | 'figcaption' | 'blockquote' | 'cite';
export type BodyProps<T extends BodyElement = 'p'> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    fontWeight?: FontWeightToken;
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;
export declare const Body: (<T extends BodyElement = "p">(props: BodyProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
}) => React.ReactElement) & {
    displayName: string;
};
export {};
