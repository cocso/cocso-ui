import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import { Content, Header, Item, Root, Trigger } from '@radix-ui/react-accordion';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import styles from './accordion.module.css';

const AccordionItem = forwardRef<ComponentRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, ref) => {
    return <Item className={cx(styles.item, className)} ref={ref} {...props} />;
  }
);

interface TriggerProps extends ComponentPropsWithoutRef<typeof Trigger> {
  chevron?: boolean;
}

const AccordionTrigger = forwardRef<ComponentRef<typeof Trigger>, TriggerProps>(
  ({ className, children, chevron = true, ...props }, ref) => {
    return (
      <Trigger className={cx(styles.trigger, className)} ref={ref} {...props}>
        {children}
        {chevron && <KeyboardArrowDownIcon className={styles.chevron} />}
      </Trigger>
    );
  }
);

const AccordionContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => {
  return <Content className={cx(styles.content, className)} ref={ref} {...props} />;
});

export const Accordion = Object.assign(Root, {
  Item: AccordionItem,
  Header,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
