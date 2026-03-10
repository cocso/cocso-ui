import type { Meta, StoryObj } from '@storybook/react';
import { StockQuantityStatus } from './stock-quantity-status';

const meta = {
  title: 'Components/StockQuantityStatus',
  component: StockQuantityStatus,
  argTypes: {
    quantity: { control: 'select', options: ['여유', '보통', '부족'] },
  },
  args: {
    quantity: '여유',
  },
} satisfies Meta<typeof StockQuantityStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <StockQuantityStatus quantity="여유" />
      <StockQuantityStatus quantity="보통" />
      <StockQuantityStatus quantity="부족" />
    </div>
  ),
};
