import { Badge } from '@cocso-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'react/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge 컴포넌트는 상태나 카테고리를 표시하는 작은 라벨입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '배지 내부에 표시될 내용',
      control: 'text',
    },
    variant: {
      description: '배지의 스타일 타입',
      control: 'select',
      options: ['default', 'danger', 'primary', 'success', 'warning'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: '배지의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 배지
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// 배지 타입별 스토리
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '5가지 배지 타입을 보여줍니다.',
      },
    },
  },
};

// 배지 크기별 스토리
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '3가지 배지 크기를 보여줍니다.',
      },
    },
  },
};

// 각 타입별로 크기 비교
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          Default Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="default" size="sm">Small</Badge>
          <Badge variant="default" size="md">Medium</Badge>
          <Badge variant="default" size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          Primary Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="primary" size="sm">Small</Badge>
          <Badge variant="primary" size="md">Medium</Badge>
          <Badge variant="primary" size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          Success Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="success" size="sm">Small</Badge>
          <Badge variant="success" size="md">Medium</Badge>
          <Badge variant="success" size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          Warning Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="warning" size="sm">Small</Badge>
          <Badge variant="warning" size="md">Medium</Badge>
          <Badge variant="warning" size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          Danger Variant
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="danger" size="sm">Small</Badge>
          <Badge variant="danger" size="md">Medium</Badge>
          <Badge variant="danger" size="lg">Large</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '각 배지 타입별로 3가지 크기를 비교해서 보여줍니다.',
      },
    },
  },
};

// 실제 사용 예시
export const UsageExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* 상태 표시 */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          상태 표시
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="success">활성</Badge>
          <Badge variant="warning">대기중</Badge>
          <Badge variant="danger">비활성</Badge>
          <Badge variant="primary">새로운</Badge>
        </div>
      </div>

      {/* 카테고리 표시 */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          카테고리 표시
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="default">일반</Badge>
          <Badge variant="primary">프리미엄</Badge>
          <Badge variant="success">완료</Badge>
          <Badge variant="warning">진행중</Badge>
          <Badge variant="danger">오류</Badge>
        </div>
      </div>

      {/* 숫자 표시 */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          숫자 표시
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="primary" size="sm">1</Badge>
          <Badge variant="success" size="sm">5</Badge>
          <Badge variant="warning" size="sm">12</Badge>
          <Badge variant="danger" size="sm">99+</Badge>
        </div>
      </div>

      {/* 텍스트와 함께 사용 */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          텍스트와 함께 사용
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>알림</span>
            <Badge variant="danger" size="sm">3</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>프로젝트 상태</span>
            <Badge variant="success">완료</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>우선순위</span>
            <Badge variant="warning" size="lg">높음</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '배지 컴포넌트의 실제 사용 예시를 보여줍니다.',
      },
    },
  },
};

// 모든 변형을 한번에 보여주는 스토리
export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px' }}>
      {/* Badge Variants */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
          Badge Variants
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </div>

      {/* Badge Sizes */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
          Badge Sizes
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="primary" size="sm">
            Small
          </Badge>
          <Badge variant="primary" size="md">
            Medium
          </Badge>
          <Badge variant="primary" size="lg">
            Large
          </Badge>
        </div>
      </div>

      {/* All Combinations */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
          All Combinations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['default', 'primary', 'success', 'warning', 'danger'].map((variant) => (
            <div key={variant} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ minWidth: '80px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}:
              </span>
              <Badge variant={variant as any} size="sm">Small</Badge>
              <Badge variant={variant as any} size="md">Medium</Badge>
              <Badge variant={variant as any} size="lg">Large</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge 컴포넌트의 모든 변형을 한번에 보여줍니다.',
      },
    },
  },
};

// Playground 스토리 (사용자가 직접 조작 가능)
export const Playground: Story = {
  args: {
    children: 'Playground Badge',
    variant: 'default',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Controls 패널을 사용하여 배지의 모든 속성을 직접 조작해볼 수 있습니다.',
      },
    },
  },
};
