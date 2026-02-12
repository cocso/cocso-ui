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
  parameters: {
    docs: { description: { story: '가장 기본적인 Popover 사용법입니다. 버튼을 클릭하면 팝오버가 열립니다.' } },
  },
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button>기본 팝오버</Button>
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

export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '폼 요소가 포함된 팝오버입니다. 간단한 입력 필드를 팝오버 안에 배치할 수 있습니다.' } },
  },
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">폼 팝오버</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div style={{ padding: '16px', width: '200px' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>설정</h4>
            <input
              type="text"
              placeholder="이름"
              style={{
                width: '100%',
                padding: '6px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  ),
};

export const Playground: Story = {
  args: {
    modal: false,
  },
};
