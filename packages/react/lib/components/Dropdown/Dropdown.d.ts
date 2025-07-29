import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
export declare const Dropdown: import("react").FC<DropdownPrimitive.DropdownMenuProps> & {
    Trigger: import("react").ForwardRefExoticComponent<DropdownPrimitive.DropdownMenuTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Portal: import("react").FC<DropdownPrimitive.DropdownMenuPortalProps>;
    Content: import("react").ForwardRefExoticComponent<Omit<DropdownPrimitive.DropdownMenuContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
    Item: import("react").ForwardRefExoticComponent<Omit<DropdownPrimitive.DropdownMenuItemProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
};
