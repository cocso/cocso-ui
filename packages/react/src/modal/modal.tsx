import { CloseIcon } from '@cocso-ui/react-icons';
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import { colors } from '../token';
import { Typography } from '../typography';
import styles from './modal.module.css';

const ModalContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => {
  return (
    <Portal>
      <Overlay className={styles.overlay} />
      <Content className={cx(styles.content, className)} ref={ref} {...props}>
        {children}
      </Content>
    </Portal>
  );
});

const ModalClose = forwardRef<ComponentRef<typeof Close>, ComponentPropsWithoutRef<typeof Close>>(
  ({ asChild, className, children, ...props }, ref) => {
    return (
      <Close
        asChild={asChild}
        className={cx(!asChild && styles.close, className)}
        ref={ref}
        {...props}
      >
        {asChild ? children : <CloseIcon size={24} />}
      </Close>
    );
  }
);

const ModalTitle = forwardRef<ComponentRef<typeof Title>, ComponentPropsWithoutRef<typeof Title>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Title asChild className={cx(styles.title, className)} ref={ref} {...props}>
        <Typography size={20} weight="bold">
          {children}
        </Typography>
      </Title>
    );
  }
);

const ModalDescription = forwardRef<
  ComponentRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, children, ...props }, ref) => {
  return (
    <Description asChild className={cx(styles.description, className)} ref={ref} {...props}>
      <Typography color={colors.textSecondary} size={14} weight="medium">
        {children}
      </Typography>
    </Description>
  );
});

export const Modal = Object.assign(Root, {
  Trigger,
  Content: ModalContent,
  Close: ModalClose,
  Title: ModalTitle,
  Description: ModalDescription,
});
