'use client';

import { Tab } from '@cocso-ui/react';

export default function TabDefault() {
  return (
    <Tab defaultValue="tab-1" style={{ width: '100%', maxWidth: 400 }}>
      <Tab.List>
        <Tab.Trigger value="tab-1">탭 1</Tab.Trigger>
        <Tab.Trigger value="tab-2">탭 2</Tab.Trigger>
        <Tab.Trigger value="tab-3">탭 3</Tab.Trigger>
      </Tab.List>
      <Tab.Content value="tab-1">첫 번째 탭의 콘텐츠입니다.</Tab.Content>
      <Tab.Content value="tab-2">두 번째 탭의 콘텐츠입니다.</Tab.Content>
      <Tab.Content value="tab-3">세 번째 탭의 콘텐츠입니다.</Tab.Content>
    </Tab>
  );
}
