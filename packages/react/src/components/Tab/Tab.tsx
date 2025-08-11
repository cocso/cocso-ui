import * as TabPrimitive from '@radix-ui/react-tabs';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import { createClassName } from '../../utils/cn';

const TabPrimitiveRoot = forwardRef<
  ComponentRef<typeof TabPrimitive.Root>,
  ComponentPropsWithoutRef<typeof TabPrimitive.Root>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-tab', {}, [], className);
  return <TabPrimitive.Root ref={ref} className={classNames} {...props} />;
});

const TabPrimitiveList = forwardRef<
  ComponentRef<typeof TabPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabPrimitive.List>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-tab-list', {}, [], className);
  return <TabPrimitive.List ref={ref} className={classNames} {...props} />;
});

const TabPrimitiveTrigger = forwardRef<
  ComponentRef<typeof TabPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-tab-trigger', {}, [], className);
  return <TabPrimitive.Trigger ref={ref} className={classNames} {...props} />;
});

const TabPrimitiveContent = forwardRef<
  ComponentRef<typeof TabPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabPrimitive.Content>
>(({ className, ...props }, ref) => {
  const classNames = createClassName('cocso-tab-content', {}, [], className);
  return <TabPrimitive.Content ref={ref} className={classNames} {...props} />;
});

export const Tab = Object.assign(TabPrimitiveRoot, {
  List: TabPrimitiveList,
  Trigger: TabPrimitiveTrigger,
  Content: TabPrimitiveContent,
});
