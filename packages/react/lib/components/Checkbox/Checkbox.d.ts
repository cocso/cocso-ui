import * as React from 'react';
export type CheckboxStatus = 'on' | 'off' | 'intermediate';
export type CheckboxProps = {
    id: string;
    size?: 'md' | 'lg';
    status: CheckboxStatus;
    onChange: (next: CheckboxStatus) => void;
    label?: string;
    disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'id'>;
export declare const Checkbox: React.ForwardRefExoticComponent<{
    id: string;
    size?: "md" | "lg";
    status: CheckboxStatus;
    onChange: (next: CheckboxStatus) => void;
    label?: string;
    disabled?: boolean;
} & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref">, "id"> & React.RefAttributes<HTMLDivElement>> & {
    displayName: string;
};
