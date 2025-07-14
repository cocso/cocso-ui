import * as AccordionPrimitive from '@radix-ui/react-accordion';
export declare const Accordion: import("react").ForwardRefExoticComponent<(AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & import("react").RefAttributes<HTMLDivElement>> & {
    Item: import("react").ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionItemProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
    Header: import("react").ForwardRefExoticComponent<AccordionPrimitive.AccordionHeaderProps & import("react").RefAttributes<HTMLHeadingElement>>;
    Trigger: import("react").ForwardRefExoticComponent<{
        chevron?: boolean;
    } & Omit<AccordionPrimitive.AccordionTriggerProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
    Content: import("react").ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
};
