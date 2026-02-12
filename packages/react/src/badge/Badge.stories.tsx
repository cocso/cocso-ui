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

const rowStyle = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Badge 사용법입니다.' } },
  },
  args: {
    children: 'Badge',
  },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 사이즈를 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 variant 스타일을 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
};
