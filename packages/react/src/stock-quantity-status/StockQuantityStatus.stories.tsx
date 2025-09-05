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

export const Default: Story = {
  args: {
    quantity: '보통',
  },
};

export const AllStates: Story = {
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

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px' }}>Stock Quantity Status Specifications</h3>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Color</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Use Case</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>여유</td>
            <td style={{ padding: '8px' }}>Primary (파란색)</td>
            <td style={{ padding: '8px' }}>재고가 충분함</td>
            <td style={{ padding: '8px' }}>
              <StockQuantityStatus quantity="여유" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>보통</td>
            <td style={{ padding: '8px' }}>Success (초록색)</td>
            <td style={{ padding: '8px' }}>재고가 보통</td>
            <td style={{ padding: '8px' }}>
              <StockQuantityStatus quantity="보통" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>부족</td>
            <td style={{ padding: '8px' }}>Danger (빨간색)</td>
            <td style={{ padding: '8px' }}>재고가 부족함</td>
            <td style={{ padding: '8px' }}>
              <StockQuantityStatus quantity="부족" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    quantity: '보통',
  },
};
