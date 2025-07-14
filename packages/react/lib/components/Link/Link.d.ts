import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
export type LinkProps = {
    asChild?: boolean;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    weight?: FontWeightToken;
    indicator?: boolean;
} & React.ComponentPropsWithoutRef<'a'>;
export declare const Link: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    size?: "lg" | "md" | "sm" | "xs";
    weight?: FontWeightToken;
    indicator?: boolean;
} & Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref"> & React.RefAttributes<HTMLAnchorElement>> & {
    displayName: string;
};
