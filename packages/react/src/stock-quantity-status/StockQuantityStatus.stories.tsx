import type { Meta, StoryObj } from '@storybook/react';
import { StockQuantityStatus } from './StockQuantityStatus';

const meta = {
  title: 'Components/StockQuantityStatus',
  component: StockQuantityStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'StockQuantityStatus 컴포넌트는 재고 수량 상태를 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    quantity: {
      description: '재고 수량 상태',
      control: 'select',
      options: ['여유', '보통', '부족'],
      table: {
        type: { summary: 'QuantityStatus' },
      },
    },
  },
} satisfies Meta<typeof StockQuantityStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}
    >
      <StockQuantityStatus quantity="여유" />
      <StockQuantityStatus quantity="보통" />
      <StockQuantityStatus quantity="부족" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    quantity: '보통',
  },
};
