import { CloseIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, ReactElement } from "react";
import { cn } from "../../cn";
import { Dialog as DialogBase } from "../../primitives/dialog";
import { colors } from "../../token";
import { Button } from "../button";
import { Typography } from "../typography";
import styles from "./dialog.module.css";

export type DialogSize = "small" | "medium" | "large";

function DialogContent({
  className,
  size = "medium",
  children,
  ...props
}: ComponentProps<typeof DialogBase.Popup> & { size?: DialogSize }) {
  return (
    <DialogBase.Portal>
      <DialogBase.Backdrop className={styles.overlay} />
      <DialogBase.Popup
        className={cn(styles.panel, styles[size], className)}
        {...props}
      >
        {children}
      </DialogBase.Popup>
    </DialogBase.Portal>
  );
}

export interface DialogCloseProps
  extends ComponentProps<typeof DialogBase.Close> {
  render?: ReactElement;
}

function DialogClose({
  className,
  render: renderProp,
  children,
  ...props
}: DialogCloseProps) {
  if (renderProp) {
    return (
      <DialogBase.Close className={className} render={renderProp} {...props} />
    );
  }
  return (
    <DialogBase.Close
      aria-label="Close"
      className={cn(styles.close, className)}
      render={
        <Button size="x-small" svgOnly variant="outline">
          <CloseIcon size={14} />
        </Button>
      }
      {...props}
    >
      {children}
    </DialogBase.Close>
  );
}

function DialogTitle({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogBase.Title>) {
  return (
    <DialogBase.Title
      className={cn(styles.title, className)}
      render={<Typography size={20} type="custom" weight="bold" />}
      {...props}
    >
      {children}
    </DialogBase.Title>
  );
}

function DialogDescription({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogBase.Description>) {
  return (
    <DialogBase.Description
      className={cn(styles.description, className)}
      render={
        <Typography
          color={colors.textSecondary}
          size={14}
          type="custom"
          weight="medium"
        />
      }
      {...props}
    >
      {children}
    </DialogBase.Description>
  );
}

export const Dialog = Object.assign(DialogBase.Root, {
  Trigger: DialogBase.Trigger,
  Content: DialogContent,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
});
