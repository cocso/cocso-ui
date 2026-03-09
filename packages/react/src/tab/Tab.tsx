import { Content, List, Root, Trigger } from '@radix-ui/react-tabs';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';

const TabPrimitiveRoot = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ ...props }, ref) => {
  return <Root ref={ref} {...props} />;
});

const TabPrimitiveList = forwardRef<
  ComponentRef<typeof List>,
  ComponentPropsWithoutRef<typeof List>
>(({ ...props }, ref) => {
  return <List ref={ref} {...props} />;
});

const TabPrimitiveTrigger = forwardRef<
  ComponentRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ ...props }, ref) => {
  return <Trigger ref={ref} {...props} />;
});

const TabPrimitiveContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ ...props }, ref) => {
  return <Content ref={ref} {...props} />;
});

export const Tab = Object.assign(TabPrimitiveRoot, {
  List: TabPrimitiveList,
  Trigger: TabPrimitiveTrigger,
  Content: TabPrimitiveContent,
});
