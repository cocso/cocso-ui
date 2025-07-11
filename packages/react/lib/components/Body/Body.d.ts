import * as React from 'react';
type BodyElement = 'p' | 'a' | 'span' | 'div' | 'label' | 'li' | 'td' | 'th' | 'figcaption' | 'blockquote' | 'cite';
export type BodyProps<T extends BodyElement = 'p'> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    fontWeight?: 'normal' | 'bold';
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'color' | 'fontWeight'>;
type BodyComponent = <T extends BodyElement = 'p'>(props: BodyProps<T> & React.RefAttributes<React.ComponentRef<T>>) => React.ReactElement;
export declare const Body: BodyComponent & {
    displayName?: string;
};
export {};
