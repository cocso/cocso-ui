import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
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
        type: { summary: 'BadgeVariant' },
      },
    },
    size: {
      description: '배지의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'BadgeSize' },
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
        story: '모든 배지 variant를 보여줍니다.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 배지 크기를 보여줍니다.',
      },
    },
  },
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px' }}>Badge Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>Variants</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Variant</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>default</td>
            <td style={{ padding: '8px' }}>기본 스타일</td>
            <td style={{ padding: '8px' }}>
              <Badge variant="default">Default</Badge>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>primary</td>
            <td style={{ padding: '8px' }}>주요 정보</td>
            <td style={{ padding: '8px' }}>
              <Badge variant="primary">Primary</Badge>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>success</td>
            <td style={{ padding: '8px' }}>성공 상태</td>
            <td style={{ padding: '8px' }}>
              <Badge variant="success">Success</Badge>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>warning</td>
            <td style={{ padding: '8px' }}>주의 필요</td>
            <td style={{ padding: '8px' }}>
              <Badge variant="warning">Warning</Badge>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>danger</td>
            <td style={{ padding: '8px' }}>오류/위험</td>
            <td style={{ padding: '8px' }}>
              <Badge variant="danger">Danger</Badge>
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Padding</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Font Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>sm</td>
            <td style={{ padding: '8px' }}>4px 8px</td>
            <td style={{ padding: '8px' }}>12px</td>
            <td style={{ padding: '8px' }}>
              <Badge size="sm">Small</Badge>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>md</td>
            <td style={{ padding: '8px' }}>6px 12px</td>
            <td style={{ padding: '8px' }}>14px</td>
            <td style={{ padding: '8px' }}>
              <Badge size="md">Medium</Badge>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>lg</td>
            <td style={{ padding: '8px' }}>8px 16px</td>
            <td style={{ padding: '8px' }}>16px</td>
            <td style={{ padding: '8px' }}>
              <Badge size="lg">Large</Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge 컴포넌트의 모든 variants와 sizes 스펙을 테이블로 보여줍니다.',
      },
    },
  },
};

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
