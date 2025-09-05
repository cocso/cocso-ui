import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';

const meta = {
  title: 'Components/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tab 컴포넌트는 여러 콘텐츠 패널 간의 전환을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      description: '기본 선택된 탭',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description: '현재 선택된 탭',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description: '탭 변경 시 호출되는 함수',
      action: 'onValueChange',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
  },
} satisfies Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => (
    <div style={{ width: '400px' }}>
      <Tab defaultValue="tab1">
        <Tab.List>
          <Tab.Trigger value="tab1">탭 1</Tab.Trigger>
          <Tab.Trigger value="tab2">탭 2</Tab.Trigger>
          <Tab.Trigger value="tab3">탭 3</Tab.Trigger>
        </Tab.List>
        <Tab.Content value="tab1">
          <div style={{ padding: '16px' }}>첫 번째 탭의 내용입니다.</div>
        </Tab.Content>
        <Tab.Content value="tab2">
          <div style={{ padding: '16px' }}>두 번째 탭의 내용입니다.</div>
        </Tab.Content>
        <Tab.Content value="tab3">
          <div style={{ padding: '16px' }}>세 번째 탭의 내용입니다.</div>
        </Tab.Content>
      </Tab>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    defaultValue: 'tab1',
  },
};
