import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './Accordion.module.css';

const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return <AccordionPrimitive.Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

interface TriggerProps extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  chevron?: boolean;
}

const AccordionTrigger = forwardRef<ComponentRef<typeof AccordionPrimitive.Trigger>, TriggerProps>(
  ({ className, children, chevron = true, ...props }, ref) => {
    return (
      <AccordionPrimitive.Trigger ref={ref} className={cx(styles.trigger, className)} {...props}>
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
    <AccordionPrimitive.Content ref={ref} className={cx(styles.content, className)} {...props} />
  );
});

export const Accordion = Object.assign(AccordionPrimitive.Root, {
  Item: AccordionItem,
  Header: AccordionPrimitive.Header,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
