import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Popover } from './popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger render={<Button variant="secondary">팝오버 열기</Button>} />
      <Popover.Content>
        <p style={{ margin: 0 }}>팝오버 내용입니다.</p>
      </Popover.Content>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger render={<Button variant="secondary">설정 열기</Button>} />
      <Popover.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>설정</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#6d7882' }}>팝오버 안에 폼 요소를 배치할 수 있습니다.</p>
        </div>
      </Popover.Content>
    </Popover>
  ),
};
