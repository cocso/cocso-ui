import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
export type HeadingProps = {
    asChild?: boolean;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    color?: string;
    weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'h2'>;
export declare const Heading: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>> & {
    displayName: string;
};
