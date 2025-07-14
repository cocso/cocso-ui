import * as ModalPrimitive from '@radix-ui/react-dialog';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';
import { Heading } from '../Heading';
import { Body } from '../Body';

type ContentProps = {
  portal?: boolean;
};

const ModalContent = forwardRef<
  ComponentRef<typeof ModalPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Portal>
      <ModalPrimitive.Overlay className="cocso-modal-overlay" />
      <ModalPrimitive.Content ref={ref} className="cocso-modal-content" {...props}>
        <div className="cocso-modal-close-wrapper">
          <ModalPrimitive.Close className="cocso-modal-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </ModalPrimitive.Close>
        </div>
        {children}
      </ModalPrimitive.Content>
    </ModalPrimitive.Portal>
  );
});

const ModalTitle = forwardRef<
  ComponentRef<typeof ModalPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Title>
>(({ className, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Title ref={ref} className="cocso-modal-title" asChild {...props}>
      <Heading color="text.basic">{children}</Heading>
    </ModalPrimitive.Title>
  );
});

const ModalDescription = forwardRef<
  ComponentRef<typeof ModalPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ModalPrimitive.Description>
>(({ className, children, ...props }, ref) => {
  return (
    <ModalPrimitive.Description ref={ref} className="cocso-modal-description" asChild {...props}>
      <Body size="sm" color="text.subtle">
        {children}
      </Body>
    </ModalPrimitive.Description>
  );
});

export const Modal = Object.assign(ModalPrimitive.Root, {
  Trigger: ModalPrimitive.Trigger,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
});
