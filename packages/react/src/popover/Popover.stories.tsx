import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Popover } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Popover 컴포넌트는 트리거 요소 근처에 떠오르는 콘텐츠를 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    modal: {
      description: '모달 모드 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button>팝오버 열기</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div style={{ padding: '16px', maxWidth: '200px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>팝오버 제목</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>팝오버의 내용입니다.</p>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  ),
};

export const Playground: Story = {
  render: args => (
    <Popover {...args}>
      <Popover.Trigger asChild>
        <Button>Playground 팝오버</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div style={{ padding: '16px', maxWidth: '200px' }}>
            <p style={{ margin: 0 }}>Controls 패널에서 설정을 조작해보세요.</p>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  ),
  args: {
    modal: false,
  },
};
