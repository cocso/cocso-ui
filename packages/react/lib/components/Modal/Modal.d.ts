import * as ModalPrimitive from '@radix-ui/react-dialog';
export declare const Modal: import("react").FC<ModalPrimitive.DialogProps> & {
    Trigger: import("react").ForwardRefExoticComponent<ModalPrimitive.DialogTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    Content: import("react").ForwardRefExoticComponent<Omit<ModalPrimitive.DialogContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
    Close: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
    Title: import("react").ForwardRefExoticComponent<Omit<ModalPrimitive.DialogTitleProps & import("react").RefAttributes<HTMLHeadingElement>, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>;
    Description: import("react").ForwardRefExoticComponent<Omit<ModalPrimitive.DialogDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>;
};
