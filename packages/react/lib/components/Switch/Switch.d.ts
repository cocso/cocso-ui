import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
export type SwitchProps = {
    asChild?: boolean;
    id: string;
    size?: 'lg' | 'md';
    disabled?: boolean;
    label?: string;
    position?: 'left' | 'right';
} & React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;
export declare const Switch: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    id: string;
    size?: "lg" | "md";
    disabled?: boolean;
    label?: string;
    position?: "left" | "right";
} & Omit<SwitchPrimitive.SwitchProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>> & {
    displayName: string;
};
