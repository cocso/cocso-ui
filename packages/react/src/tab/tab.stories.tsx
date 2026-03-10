import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './tab';

const meta = {
  title: 'Components/Tab',
  component: Tab,
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tab defaultValue="tab-1">
      <Tab.List>
        <Tab.Trigger value="tab-1">탭 1</Tab.Trigger>
        <Tab.Trigger value="tab-2">탭 2</Tab.Trigger>
        <Tab.Trigger value="tab-3">탭 3</Tab.Trigger>
      </Tab.List>
      <Tab.Content value="tab-1">
        <p>탭 1의 내용입니다.</p>
      </Tab.Content>
      <Tab.Content value="tab-2">
        <p>탭 2의 내용입니다.</p>
      </Tab.Content>
      <Tab.Content value="tab-3">
        <p>탭 3의 내용입니다.</p>
      </Tab.Content>
    </Tab>
  ),
};
