import * as TabPrimitive from '@radix-ui/react-tabs';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';

const TabPrimitiveRoot = forwardRef<
  ComponentRef<typeof TabPrimitive.Root>,
  ComponentPropsWithoutRef<typeof TabPrimitive.Root>
>(({ ...props }, ref) => {
  return <TabPrimitive.Root ref={ref} {...props} />;
});

const TabPrimitiveList = forwardRef<
  ComponentRef<typeof TabPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabPrimitive.List>
>(({ ...props }, ref) => {
  return <TabPrimitive.List ref={ref} {...props} />;
});

const TabPrimitiveTrigger = forwardRef<
  ComponentRef<typeof TabPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabPrimitive.Trigger>
>(({ ...props }, ref) => {
  return <TabPrimitive.Trigger ref={ref} {...props} />;
});

const TabPrimitiveContent = forwardRef<
  ComponentRef<typeof TabPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabPrimitive.Content>
>(({ ...props }, ref) => {
  return <TabPrimitive.Content ref={ref} {...props} />;
});

export const Tab = Object.assign(TabPrimitiveRoot, {
  List: TabPrimitiveList,
  Trigger: TabPrimitiveTrigger,
  Content: TabPrimitiveContent,
});
