import type { ComponentProps } from "react";
import { Tabs } from "../../primitives/tabs";

export type TabProps = ComponentProps<typeof Tabs.Root>;
export type TabListProps = ComponentProps<typeof Tabs.List>;
export type TabTriggerProps = ComponentProps<typeof Tabs.Tab>;
export type TabContentProps = ComponentProps<typeof Tabs.Panel>;

function TabRoot(props: TabProps) {
  return <Tabs.Root {...props} />;
}

function TabList(props: TabListProps) {
  return <Tabs.List {...props} />;
}

function TabTrigger(props: TabTriggerProps) {
  return <Tabs.Tab {...props} />;
}

function TabContent(props: TabContentProps) {
  return <Tabs.Panel {...props} />;
}

export const Tab = Object.assign(TabRoot, {
  displayName: "Tab" as const,
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
});
