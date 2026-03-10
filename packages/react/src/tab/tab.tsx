import { Tabs } from '@base-ui/react/tabs';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';

const TabRoot = forwardRef<
  ComponentRef<typeof Tabs.Root>,
  ComponentPropsWithoutRef<typeof Tabs.Root>
>(({ ...props }, ref) => {
  return <Tabs.Root ref={ref} {...props} />;
});

const TabList = forwardRef<
  ComponentRef<typeof Tabs.List>,
  ComponentPropsWithoutRef<typeof Tabs.List>
>(({ ...props }, ref) => {
  return <Tabs.List ref={ref} {...props} />;
});

const TabTrigger = forwardRef<
  ComponentRef<typeof Tabs.Tab>,
  ComponentPropsWithoutRef<typeof Tabs.Tab>
>(({ ...props }, ref) => {
  return <Tabs.Tab ref={ref} {...props} />;
});

const TabContent = forwardRef<
  ComponentRef<typeof Tabs.Panel>,
  ComponentPropsWithoutRef<typeof Tabs.Panel>
>(({ ...props }, ref) => {
  return <Tabs.Panel ref={ref} {...props} />;
});

export const Tab = Object.assign(TabRoot, {
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
});
