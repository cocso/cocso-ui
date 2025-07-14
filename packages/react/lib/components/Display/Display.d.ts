import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
export type DisplayProps = {
    asChild?: boolean;
    size?: 'lg' | 'md' | 'sm';
    color?: string;
    weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'h1'>;
export declare const Display: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    size?: "lg" | "md" | "sm";
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>> & {
    displayName: string;
};
