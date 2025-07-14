import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
export type BodyProps = {
    asChild?: boolean;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'p'>;
export declare const Body: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    size?: "lg" | "md" | "sm" | "xs";
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>> & {
    displayName: string;
};
