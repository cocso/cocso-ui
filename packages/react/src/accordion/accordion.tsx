import { Accordion as AccordionBase } from "@base-ui/react/accordion";
import { KeyboardArrowDownIcon } from "@cocso-ui/react-icons";
import { clsx as cx } from "clsx";
import type { ComponentProps } from "react";
import styles from "./accordion.module.css";

function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionBase.Item>) {
  return (
    <AccordionBase.Item
      className={cx(styles.item, className)}
      {...props}
    />
  );
}

export interface TriggerProps
  extends ComponentProps<typeof AccordionBase.Trigger> {
  chevron?: boolean;
}

function AccordionTrigger({
  className,
  children,
  chevron = true,
  ...props
}: TriggerProps) {
  return (
    <AccordionBase.Trigger
      className={cx(styles.trigger, className)}
      {...props}
    >
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
    <AccordionBase.Panel
      className={cx(styles.content, className)}
      {...props}
    />
  );
}

export const Accordion = Object.assign(AccordionBase.Root, {
  Item: AccordionItem,
  Header: AccordionBase.Header,
  Trigger: AccordionTrigger,
  Content: AccordionPanel,
});
