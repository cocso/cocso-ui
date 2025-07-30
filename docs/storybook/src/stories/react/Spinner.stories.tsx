import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@cocso-ui/react';

const meta = {
  title: 'react/spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs'],
    },
    color: {
      control: 'color',
    },
    bg: {
      control: 'color',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="lg" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Large</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Medium</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="sm" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Small</span>
          </div>
        </div>
      </div>

      {}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Colors</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#256EF4" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Primary</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#D63D4A" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Danger</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#228738" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Success</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#9E6A00" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Warning</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#6D7882" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Gray</span>
          </div>
        </div>
      </div>

      {}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Background Colors
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#256EF4" bg="#E5E7EB" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Light Gray BG</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#FFFFFF" bg="#1F2937" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Dark BG</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <Spinner size="md" color="#256EF4" bg="#F3F4F6" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Light BG</span>
          </div>
        </div>
      </div>

      {}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Usage Examples
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Spinner size="sm" color="#256EF4" />
            <span>Loading...</span>
          </div>

          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>데이터를 불러오는 중</span>
            <Spinner size="sm" color="#6D7882" />
          </div>

          {}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '24px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          >
            <Spinner size="lg" color="#256EF4" />
            <span style={{ color: '#6B7280' }}>페이지를 불러오는 중입니다...</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
