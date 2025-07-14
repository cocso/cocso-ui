import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';
import { Slottable } from '@radix-ui/react-slot';

const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-accordion-item', {}, [], className);
  return <AccordionPrimitive.Item ref={ref} className={classNames} {...props} />;
});

type TriggerProps = {
  chevron?: boolean;
} & ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = forwardRef<ComponentRef<typeof AccordionPrimitive.Trigger>, TriggerProps>(
  ({ className, children, chevron = true, ...props }, ref) => {
    const classNames = createClassName('cocso-accordion-trigger', {}, [], className);
    return (
      <AccordionPrimitive.Trigger ref={ref} className={classNames} {...props}>
        <Slottable>{children}</Slottable>
        {chevron && (
          <div className="cocso-accordion-chevron">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        )}
      </AccordionPrimitive.Trigger>
    );
  },
);

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-accordion-content', {}, [], className);
  return <AccordionPrimitive.Content ref={ref} className={classNames} {...props} />;
});

export const Accordion = Object.assign(AccordionPrimitive.Root, {
  Item: AccordionPrimitive.Item,
  Header: AccordionPrimitive.Header,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
