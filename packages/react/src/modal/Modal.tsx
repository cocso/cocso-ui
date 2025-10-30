import { CloseIcon } from '@cocso-ui/react-icons';
import * as ModalPrimitive from '@radix-ui/react-dialog';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import { colors } from '../token';
import { Typography } from '../typography';
import styles from './Modal.module.css';

const ModalContent = forwardRef<
  ComponentRef<typeof ModalPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Portal>
      <ModalPrimitive.Overlay className={styles.overlay} />
      <ModalPrimitive.Content ref={ref} className={cx(styles.content, className)} {...props}>
        {children}
      </ModalPrimitive.Content>
    </ModalPrimitive.Portal>
  );
});

const ModalClose = forwardRef<
  ComponentRef<typeof ModalPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Close>
>(({ asChild, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Close ref={ref} asChild={asChild} {...props}>
      {asChild ? (
        children
      ) : (
        <span className={styles.close}>
          <CloseIcon size={24} />
        </span>
      )}
    </ModalPrimitive.Close>
  );
});

const ModalTitle = forwardRef<
  ComponentRef<typeof ModalPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Title>
>(({ className, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Title ref={ref} className={cx(styles.title, className)} asChild {...props}>
      <Typography size={20} weight="bold">
        {children}
      </Typography>
    </ModalPrimitive.Title>
  );
});

const ModalDescription = forwardRef<
  ComponentRef<typeof ModalPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Description>
>(({ className, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Description
      ref={ref}
      className={cx(styles.description, className)}
      asChild
      {...props}
    >
      <Typography size={14} color={colors.textSecondary} weight="medium">
        {children}
      </Typography>
    </ModalPrimitive.Description>
  );
});

export const Modal = Object.assign(ModalPrimitive.Root, {
  Trigger: ModalPrimitive.Trigger,
  Content: ModalContent,
  Close: ModalClose,
  Title: ModalTitle,
  Description: ModalDescription,
});
