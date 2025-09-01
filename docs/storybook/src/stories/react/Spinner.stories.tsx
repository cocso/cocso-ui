import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@cocso-ui/react';

const meta = {
  title: 'react/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spinner 컴포넌트는 로딩 상태를 표시하는 회전하는 애니메이션입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: '스피너의 크기',
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      description: '스피너의 색상',
      control: 'select',
      options: ['primary', 'neutral', 'white'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    asChild: {
      description: '다른 컴포넌트로 렌더링할지 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 스피너
export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

// 크기별 스피너
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner size="sm" />
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Small (20px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner size="md" />
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Medium (24px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner size="lg" />
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Large (32px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner size="xl" />
        <span style={{ fontSize: '12px', color: '#6B7280' }}>XLarge (40px)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '4가지 크기의 스피너를 보여줍니다.',
      },
    },
  },
};

// 색상별 스피너
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner size="md" color="primary" />
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Primary</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner size="md" color="neutral" />
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Neutral</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ 
          backgroundColor: '#1F2937', 
          padding: '16px', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Spinner size="md" color="white" />
        </div>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>White (Dark BG)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '3가지 색상의 스피너를 보여줍니다.',
      },
    },
  },
};

// 사용 예시
export const UsageExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      {/* 기본 로딩 텍스트 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Spinner size="sm" color="primary" />
        <span>Loading...</span>
      </div>

      {/* 텍스트가 뒤에 있는 경우 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>데이터를 불러오는 중</span>
        <Spinner size="sm" color="neutral" />
      </div>

      {/* 큰 스피너와 설명 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '32px',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        backgroundColor: '#F9FAFB'
      }}>
        <Spinner size="lg" color="primary" />
        <span style={{ color: '#6B7280', fontSize: '14px' }}>페이지를 불러오는 중입니다...</span>
      </div>

      {/* 버튼 내부 스피너 */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <Spinner size="sm" color="white" />
          Processing...
        </button>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: '#6B7280',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <Spinner size="sm" color="white" />
          Saving...
        </button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 사용 사례를 보여줍니다.',
      },
    },
  },
};

// 모든 변형을 한번에 보여주는 스토리
export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
      {/* Sizes */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Spinner Sizes</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="sm" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Small</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="md" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Medium</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="lg" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Large</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="xl" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>XLarge</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Spinner Colors</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="md" color="primary" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Primary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="md" color="neutral" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Neutral</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '16px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Spinner size="md" color="white" />
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>White</span>
          </div>
        </div>
      </div>

      {/* Size and Color Combinations */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Size & Color Combinations</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="sm" color="primary" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Small Primary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="md" color="neutral" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Medium Neutral</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Spinner size="lg" color="primary" />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Large Primary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '20px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Spinner size="xl" color="white" />
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>XLarge White</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinner 컴포넌트의 모든 변형을 한번에 보여줍니다.',
      },
    },
  },
};

// Playground 스토리 (사용자가 직접 조작 가능)
export const Playground: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Controls 패널을 사용하여 스피너의 모든 속성을 직접 조작해볼 수 있습니다.',
      },
    },
  },
};
