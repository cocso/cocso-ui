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

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 StockQuantityStatus 사용법입니다.' } },
  },
  args: {
    quantity: '보통',
  },
};

export const AllStatuses: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '모든 재고 상태(여유, 보통, 부족)를 비교합니다.' } },
  },
  render: () => (
    <div style={columnStyle}>
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
