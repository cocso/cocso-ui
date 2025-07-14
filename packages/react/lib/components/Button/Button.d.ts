import * as React from 'react';
import { type FontWeightToken } from '../../utils/token';
export type ButtonProps = {
    asChild?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'text';
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    disabled?: boolean;
    loading?: boolean;
    color?: string;
    weight?: FontWeightToken;
} & React.ComponentPropsWithoutRef<'button'>;
export declare const Button: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    variant?: "primary" | "secondary" | "tertiary" | "danger" | "success" | "text";
    size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
    disabled?: boolean;
    loading?: boolean;
    color?: string;
    weight?: FontWeightToken;
} & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>> & {
    displayName: string;
};
