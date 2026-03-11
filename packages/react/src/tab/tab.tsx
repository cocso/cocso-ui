import { Tabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

function TabRoot(props: ComponentProps<typeof Tabs.Root>) {
  return <Tabs.Root {...props} />;
}

function TabList(props: ComponentProps<typeof Tabs.List>) {
  return <Tabs.List {...props} />;
}

function TabTrigger(props: ComponentProps<typeof Tabs.Tab>) {
  return <Tabs.Tab {...props} />;
}

function TabContent(props: ComponentProps<typeof Tabs.Panel>) {
  return <Tabs.Panel {...props} />;
}

export const Tab = Object.assign(TabRoot, {
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
});
