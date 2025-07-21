import * as React from 'react';
export type SelectProps = {
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
    disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'select'>, 'size'>;
export declare const Select: React.ForwardRefExoticComponent<{
    size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
    disabled?: boolean;
} & Omit<Omit<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "ref">, "size"> & React.RefAttributes<HTMLSelectElement>> & {
    displayName: string;
};
