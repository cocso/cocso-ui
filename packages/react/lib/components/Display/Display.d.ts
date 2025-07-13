import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
declare const tags: readonly ["h1", "h2", "h3", "h4", "h5", "h6"];
type Element = (typeof tags)[number];
type Default = (typeof tags)[0];
export type DisplayProps<T extends Element = Default> = {
    as?: T;
    size?: 'lg' | 'md' | 'sm';
    color?: string;
    weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<T>;
export declare const Display: React.ForwardRefExoticComponent<{
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
    size?: "lg" | "md" | "sm";
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>> & {
    displayName: string;
};
export {};
