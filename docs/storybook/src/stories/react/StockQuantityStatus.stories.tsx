import type { Meta, StoryObj } from '@storybook/react';
import { StockQuantityStatus } from '@cocso-ui/react';

const meta = {
  title: 'React/StockQuantityStatus',
  component: StockQuantityStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    quantity: {
      control: 'select',
      options: ['보통', '여유', '부족'],
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

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Quantity Statuses */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Quantity Statuses</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <StockQuantityStatus quantity="여유" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>여유</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <StockQuantityStatus quantity="보통" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>보통</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <StockQuantityStatus quantity="부족" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>부족</span>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Usage Examples
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Product List Item */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>아스피린 500mg</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>제품코드: ASP-001</div>
            </div>
            <StockQuantityStatus quantity="여유" />
          </div>

          {/* Product List Item */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>타이레놀 650mg</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>제품코드: TYL-002</div>
            </div>
            <StockQuantityStatus quantity="보통" />
          </div>

          {/* Product List Item */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>이부프로펜 400mg</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>제품코드: IBU-003</div>
            </div>
            <StockQuantityStatus quantity="부족" />
          </div>
        </div>
      </div>

      {/* Status Meanings */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Status Meanings
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StockQuantityStatus quantity="여유" />
            <span style={{ fontSize: '14px' }}>재고가 충분하여 안전한 상태</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StockQuantityStatus quantity="보통" />
            <span style={{ fontSize: '14px' }}>재고가 적정 수준으로 유지되는 상태</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StockQuantityStatus quantity="부족" />
            <span style={{ fontSize: '14px' }}>재고가 부족하여 보충이 필요한 상태</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const 여유: Story = {
  args: {
    quantity: '여유',
  },
};

export const 보통: Story = {
  args: {
    quantity: '보통',
  },
};

export const 부족: Story = {
  args: {
    quantity: '부족',
  },
}; 