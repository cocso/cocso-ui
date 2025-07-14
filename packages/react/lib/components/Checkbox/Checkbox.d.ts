import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
export type CheckboxStatus = 'on' | 'off' | 'intermediate';
export type CheckboxProps = {
    id?: string;
    size?: 'lg' | 'md' | 'sm';
    status: CheckboxStatus;
    onChange: (next: CheckboxStatus) => void;
    label?: string;
    disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'checked' | 'onCheckedChange'>;
export declare const Checkbox: React.ForwardRefExoticComponent<{
    id?: string;
    size?: "lg" | "md" | "sm";
    status: CheckboxStatus;
    onChange: (next: CheckboxStatus) => void;
    label?: string;
    disabled?: boolean;
} & Omit<Omit<CheckboxPrimitive.CheckboxProps & React.RefAttributes<HTMLButtonElement>, "ref">, "checked" | "onCheckedChange"> & React.RefAttributes<HTMLButtonElement>> & {
    displayName: string;
};
