import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx as cn } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './Accordion.module.css';

const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return <AccordionPrimitive.Item ref={ref} className={cn(styles.item, className)} {...props} />;
});

type TriggerProps = {
  chevron?: boolean;
} & ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = forwardRef<ComponentRef<typeof AccordionPrimitive.Trigger>, TriggerProps>(
  ({ className, children, chevron = true, ...props }, ref) => {
    return (
      <AccordionPrimitive.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
        {children}
        {chevron && <KeyboardArrowDownIcon className={styles.chevron} />}
      </AccordionPrimitive.Trigger>
    );
  },
);

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content ref={ref} className={cn(styles.content, className)} {...props} />
  );
});

export const Accordion = Object.assign(AccordionPrimitive.Root, {
  Item: AccordionItem,
  Header: AccordionPrimitive.Header,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
