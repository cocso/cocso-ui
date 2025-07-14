import * as ModalPrimitive from '@radix-ui/react-dialog';
export declare const Modal: import("react").FC<ModalPrimitive.DialogProps> & {
    Trigger: import("react").ForwardRefExoticComponent<ModalPrimitive.DialogTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Content: import("react").ForwardRefExoticComponent<Omit<ModalPrimitive.DialogContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<never>>;
    Title: import("react").ForwardRefExoticComponent<Omit<ModalPrimitive.DialogTitleProps & import("react").RefAttributes<HTMLHeadingElement>, "ref"> & import("react").RefAttributes<never>>;
    Description: import("react").ForwardRefExoticComponent<Omit<ModalPrimitive.DialogDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>, "ref"> & import("react").RefAttributes<never>>;
};
