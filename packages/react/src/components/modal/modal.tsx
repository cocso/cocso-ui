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

/** Props for the {@link Modal.Close} sub-component. */
export interface ModalCloseProps
  extends ComponentProps<typeof DialogBase.Close> {
  /** Custom element to render in place of the default close icon button. */
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

/**
 * A dialog modal built on Base UI's Dialog primitive.
 *
 * Composed sub-components:
 * - `Modal.Trigger` — element that opens the dialog.
 * - `Modal.Content` — portal-rendered backdrop and popup container.
 * - `Modal.Close` — button that closes the dialog; renders a default close icon when no children are provided.
 * - `Modal.Title` — accessible dialog title styled as bold heading.
 * - `Modal.Description` — accessible dialog description styled as secondary body text.
 */
export const Modal = Object.assign(DialogBase.Root, {
  Trigger: DialogBase.Trigger,
  Content: ModalContent,
  Close: ModalClose,
  Title: ModalTitle,
  Description: ModalDescription,
});
