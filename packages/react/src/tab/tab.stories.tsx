import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './tab';

const meta = {
  title: 'Components/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
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

export const ManyTabs: Story = {
  render: () => (
    <Tab defaultValue="tab-1">
      <Tab.List>
        {['탭 1', '탭 2', '탭 3', '탭 4', '탭 5'].map((label, i) => (
          <Tab.Trigger key={i} value={`tab-${i + 1}`}>{label}</Tab.Trigger>
        ))}
      </Tab.List>
      {['첫 번째', '두 번째', '세 번째', '네 번째', '다섯 번째'].map((label, i) => (
        <Tab.Content key={i} value={`tab-${i + 1}`}>
          <p>{label} 탭의 내용입니다.</p>
        </Tab.Content>
      ))}
    </Tab>
  ),
};
