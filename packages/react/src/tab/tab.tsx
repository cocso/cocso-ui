import { Tabs } from "@base-ui/react/tabs";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

const TabRoot = forwardRef<
  ComponentRef<typeof Tabs.Root>,
  ComponentPropsWithoutRef<typeof Tabs.Root>
>(({ ...props }, ref) => <Tabs.Root ref={ref} {...props} />);

const TabList = forwardRef<
  ComponentRef<typeof Tabs.List>,
  ComponentPropsWithoutRef<typeof Tabs.List>
>(({ ...props }, ref) => <Tabs.List ref={ref} {...props} />);

const TabTrigger = forwardRef<
  ComponentRef<typeof Tabs.Tab>,
  ComponentPropsWithoutRef<typeof Tabs.Tab>
>(({ ...props }, ref) => <Tabs.Tab ref={ref} {...props} />);

const TabContent = forwardRef<
  ComponentRef<typeof Tabs.Panel>,
  ComponentPropsWithoutRef<typeof Tabs.Panel>
>(({ ...props }, ref) => <Tabs.Panel ref={ref} {...props} />);

export const Tab = Object.assign(TabRoot, {
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
});
