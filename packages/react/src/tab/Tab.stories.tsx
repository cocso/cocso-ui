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

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Tab 사용법입니다. 탭을 클릭하면 해당 콘텐츠가 표시됩니다.' } },
  },
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

export const WithContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '다양한 콘텐츠를 포함한 탭입니다. 각 패널에 서로 다른 정보를 표시합니다.' } },
  },
  render: () => (
    <div style={{ width: '400px' }}>
      <Tab defaultValue="profile">
        <Tab.List>
          <Tab.Trigger value="profile">프로필</Tab.Trigger>
          <Tab.Trigger value="settings">설정</Tab.Trigger>
          <Tab.Trigger value="notifications">알림</Tab.Trigger>
        </Tab.List>
        <Tab.Content value="profile">
          <div style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>프로필 정보</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>사용자 프로필 정보를 확인하고 수정할 수 있습니다.</p>
          </div>
        </Tab.Content>
        <Tab.Content value="settings">
          <div style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>설정</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>애플리케이션 설정을 관리합니다.</p>
          </div>
        </Tab.Content>
        <Tab.Content value="notifications">
          <div style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>알림 설정</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>알림 수신 설정을 관리합니다.</p>
          </div>
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
