import { CloseIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, ReactElement } from "react";
import { cn } from "../../cn";
import { Dialog as DialogBase } from "../../primitives/dialog";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./modal.module.css";

function ModalContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogBase.Popup>) {
  return (
    <DialogBase.Portal>
      <DialogBase.Backdrop className={styles.overlay} />
      <DialogBase.Popup className={cn(styles.content, className)} {...props}>
        {children}
      </DialogBase.Popup>
    </DialogBase.Portal>
  );
}

export interface ModalCloseProps
  extends ComponentProps<typeof DialogBase.Close> {
  render?: ReactElement;
}

function ModalClose({
  className,
  render: renderProp,
  children,
  ...props
}: ModalCloseProps) {
  if (renderProp) {
    return (
      <DialogBase.Close className={className} render={renderProp} {...props} />
    );
  }
  return (
    <DialogBase.Close className={cn(styles.close, className)} {...props}>
      {children ?? <CloseIcon size={24} />}
    </DialogBase.Close>
  );
}

function ModalTitle({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogBase.Title>) {
  return (
    <DialogBase.Title
      className={cn(styles.title, className)}
      render={<Typography size={20} weight="bold" />}
      {...props}
    >
      {children}
    </DialogBase.Title>
  );
}

function ModalDescription({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogBase.Description>) {
  return (
    <DialogBase.Description
      className={cn(styles.description, className)}
      render={
        <Typography color={colors.textSecondary} size={14} weight="medium" />
      }
      {...props}
    >
      {children}
    </DialogBase.Description>
  );
}

export const Modal = Object.assign(DialogBase.Root, {
  Trigger: DialogBase.Trigger,
  Content: ModalContent,
  Close: ModalClose,
  Title: ModalTitle,
  Description: ModalDescription,
});
