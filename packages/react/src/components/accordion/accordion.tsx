import { KeyboardArrowDownIcon } from "@cocso-ui/react-icons";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import { Accordion as AccordionBase } from "../../primitives/accordion";
import styles from "./accordion.module.css";

function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionBase.Item>) {
  return (
    <AccordionBase.Item className={cn(styles.item, className)} {...props} />
  );
}

export interface AccordionTriggerProps
  extends ComponentProps<typeof AccordionBase.Trigger> {
  chevron?: boolean;
}

function AccordionTrigger({
  className,
  children,
  chevron = true,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionBase.Trigger className={cn(styles.trigger, className)} {...props}>
      {children}
      {chevron && <KeyboardArrowDownIcon className={styles.chevron} />}
    </AccordionBase.Trigger>
  );
}

function AccordionPanel({
  className,
  ...props
}: ComponentProps<typeof AccordionBase.Panel>) {
  return (
    <AccordionBase.Panel className={cn(styles.content, className)} {...props} />
  );
}

export const Accordion = Object.assign(AccordionBase.Root, {
  Item: AccordionItem,
  Header: AccordionBase.Header,
  Trigger: AccordionTrigger,
  Content: AccordionPanel,
});
