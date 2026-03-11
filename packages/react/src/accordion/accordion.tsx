import { Accordion as AccordionBase } from "@base-ui/react/accordion";
import { KeyboardArrowDownIcon } from "@cocso-ui/react-icons";
import { clsx as cx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import styles from "./accordion.module.css";

const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionBase.Item>
>(({ className, ...props }, ref) => (
  <AccordionBase.Item
    className={cx(styles.item, className)}
    ref={ref}
    {...props}
  />
));

interface TriggerProps
  extends ComponentPropsWithoutRef<typeof AccordionBase.Trigger> {
  chevron?: boolean;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, chevron = true, ...props }, ref) => (
    <AccordionBase.Trigger
      className={cx(styles.trigger, className)}
      ref={ref}
      {...props}
    >
      {children}
      {chevron && <KeyboardArrowDownIcon className={styles.chevron} />}
    </AccordionBase.Trigger>
  )
);

const AccordionPanel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionBase.Panel>
>(({ className, ...props }, ref) => (
  <AccordionBase.Panel
    className={cx(styles.content, className)}
    ref={ref}
    {...props}
  />
));

export const Accordion = Object.assign(AccordionBase.Root, {
  Item: AccordionItem,
  Header: AccordionBase.Header,
  Trigger: AccordionTrigger,
  Content: AccordionPanel,
});
