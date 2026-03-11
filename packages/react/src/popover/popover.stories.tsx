import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Popover } from './popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
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
