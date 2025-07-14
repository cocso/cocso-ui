import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-accordion-content', {}, [], className);
  return <AccordionPrimitive.Content ref={ref} className={classNames} {...props} />;
});

const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-accordion-trigger', {}, [], className);
  return <AccordionPrimitive.Trigger ref={ref} className={classNames} {...props} />;
});

export const Accordion = Object.assign(AccordionPrimitive.Root, {
  Item: AccordionPrimitive.Item,
  Header: AccordionPrimitive.Header,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
