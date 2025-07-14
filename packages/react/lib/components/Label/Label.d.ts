import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
export type LabelProps = {
    asChild?: boolean;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'label'>;
export declare const Label: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    size?: "lg" | "md" | "sm" | "xs";
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, "ref"> & React.RefAttributes<HTMLLabelElement>> & {
    displayName: string;
};
