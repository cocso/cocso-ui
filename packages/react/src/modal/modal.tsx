import { Dialog as DialogBase } from "@base-ui/react/dialog";
import { CloseIcon } from "@cocso-ui/react-icons";
import { clsx as cx } from "clsx";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import { forwardRef } from "react";
import { colors } from "../token";
import { Typography } from "../typography";
import styles from "./modal.module.css";

const ModalContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogBase.Popup>
>(({ className, children, ...props }, ref) => (
  <DialogBase.Portal>
    <DialogBase.Backdrop className={styles.overlay} />
    <DialogBase.Popup
      className={cx(styles.content, className)}
      ref={ref}
      {...props}
    >
      {children}
    </DialogBase.Popup>
  </DialogBase.Portal>
));

interface ModalCloseProps
  extends ComponentPropsWithoutRef<typeof DialogBase.Close> {
  render?: ReactElement;
}

const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, render: renderProp, ...props }, ref) => {
    if (renderProp) {
      return (
        <DialogBase.Close
          className={className}
          ref={ref}
          render={renderProp}
          {...props}
        />
      );
    }
    return (
      <DialogBase.Close
        className={cx(styles.close, className)}
        ref={ref}
        {...props}
      >
        <CloseIcon size={24} />
      </DialogBase.Close>
    );
  }
);

const ModalTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogBase.Title>
>(({ className, children, ...props }, ref) => (
  <DialogBase.Title
    className={cx(styles.title, className)}
    ref={ref}
    render={<Typography size={20} weight="bold" />}
    {...props}
  >
    {children}
  </DialogBase.Title>
));

const ModalDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogBase.Description>
>(({ className, children, ...props }, ref) => (
  <DialogBase.Description
    className={cx(styles.description, className)}
    ref={ref}
    render={
      <Typography color={colors.textSecondary} size={14} weight="medium" />
    }
    {...props}
  >
    {children}
  </DialogBase.Description>
));

export const Modal = Object.assign(DialogBase.Root, {
  Trigger: DialogBase.Trigger,
  Content: ModalContent,
  Close: ModalClose,
  Title: ModalTitle,
  Description: ModalDescription,
});
