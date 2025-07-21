import * as React from 'react';
export type SelectProps = {
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    disabled?: boolean;
} & React.ComponentPropsWithoutRef<'select'>;
export declare const Select: React.ForwardRefExoticComponent<{
    size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
    disabled?: boolean;
} & Omit<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "ref"> & React.RefAttributes<HTMLSelectElement>> & {
    displayName: string;
};
