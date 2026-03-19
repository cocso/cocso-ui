import type { ComponentProps } from "react";
import { Tabs } from "../primitives/tabs";

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

/**
 * A tab navigation component composed of a Root, List, Trigger, and Content.
 * Wraps Base UI's Tabs primitives.
 *
 * @example
 * <Tab defaultValue="a">
 *   <Tab.List>
 *     <Tab.Trigger value="a">Tab A</Tab.Trigger>
 *   </Tab.List>
 *   <Tab.Content value="a">Panel A</Tab.Content>
 * </Tab>
 */
export const Tab = Object.assign(TabRoot, {
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
});
