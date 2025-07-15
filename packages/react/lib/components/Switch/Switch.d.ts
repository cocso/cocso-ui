import * as SwitchPrimitive from '@radix-ui/react-switch';
export declare const Switch: import("react").ForwardRefExoticComponent<{
    id: string;
    size?: "lg" | "md";
    disabled?: boolean;
    label?: string;
    position?: "left" | "right";
} & Omit<SwitchPrimitive.SwitchProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
