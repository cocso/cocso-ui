import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Tooltip } from './tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button variant="outline">마우스를 올려보세요</Button>} />
      <Tooltip.Content>
        <Tooltip.Arrow />
        툴팁 내용입니다.
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const SideBottom: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <Tooltip.Trigger render={<Button variant="outline">아래 (Bottom)</Button>} />
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        아래쪽 툴팁
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const SideTop: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <Tooltip.Trigger render={<Button variant="outline">위 (Top)</Button>} />
      <Tooltip.Content side="top">
        <Tooltip.Arrow />
        위쪽 툴팁
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const SideLeft: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <Tooltip.Trigger render={<Button variant="outline">왼쪽 (Left)</Button>} />
      <Tooltip.Content side="left">
        <Tooltip.Arrow />
        왼쪽 툴팁
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const SideRight: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <Tooltip.Trigger render={<Button variant="outline">오른쪽 (Right)</Button>} />
      <Tooltip.Content side="right">
        <Tooltip.Arrow />
        오른쪽 툴팁
      </Tooltip.Content>
    </Tooltip>
  ),
};
