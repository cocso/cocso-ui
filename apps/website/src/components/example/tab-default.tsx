"use client";

import { Tab } from "@cocso-ui/react";

export default function TabDefault() {
  return (
    <div className="w-full max-w-md p-4">
      <Tab defaultValue="tab1">
        <Tab.List>
          <Tab.Trigger value="tab1">Account</Tab.Trigger>
          <Tab.Trigger value="tab2">Security</Tab.Trigger>
          <Tab.Trigger value="tab3">Notifications</Tab.Trigger>
        </Tab.List>
        <Tab.Content className="p-4 text-sm" value="tab1">
          Manage your account settings and preferences.
        </Tab.Content>
        <Tab.Content className="p-4 text-sm" value="tab2">
          Update your password and security settings.
        </Tab.Content>
        <Tab.Content className="p-4 text-sm" value="tab3">
          Configure notification preferences.
        </Tab.Content>
      </Tab>
    </div>
  );
}
