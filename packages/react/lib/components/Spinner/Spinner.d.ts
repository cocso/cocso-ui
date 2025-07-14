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
export declare const Spinner: React.ForwardRefExoticComponent<{
    as?: "div" | undefined;
    size?: "xl" | "lg" | "md" | "sm" | "xs";
    color?: string;
    bg?: string;
} & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref">, "color" | "size"> & React.RefAttributes<HTMLDivElement>> & {
    displayName: string;
};
export {};
