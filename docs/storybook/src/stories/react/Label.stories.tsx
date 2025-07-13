import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@cocso-ui/react';

const meta = {
  title: 'React/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['label'],
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'xs'],
    },
    color: {
      control: 'color',
    },
    weight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '라벨 텍스트',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label size="lg">큰 라벨 텍스트</Label>
          <Label size="md">중간 라벨 텍스트</Label>
          <Label size="sm">작은 라벨 텍스트</Label>
          <Label size="xs">매우 작은 라벨 텍스트</Label>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Font Weights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label weight="thin">Thin 라벨</Label>
          <Label weight="light">Light 라벨</Label>
          <Label weight="normal">Normal 라벨</Label>
          <Label weight="medium">Medium 라벨</Label>
          <Label weight="semibold">Semibold 라벨</Label>
          <Label weight="bold">Bold 라벨</Label>
          <Label weight="extrabold">Extrabold 라벨</Label>
          <Label weight="black">Black 라벨</Label>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Colors</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label color="red">빨간색 라벨</Label>
          <Label color="blue">파란색 라벨</Label>
          <Label color="green">초록색 라벨</Label>
          <Label color="purple">보라색 라벨</Label>
          <Label color="orange">주황색 라벨</Label>
        </div>
      </div>

      {/* Size and Weight Combinations */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Size and Weight Combinations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label size="lg" weight="bold">큰 굵은 라벨</Label>
          <Label size="md" weight="semibold">중간 세미볼드 라벨</Label>
          <Label size="sm" weight="medium">작은 미디엄 라벨</Label>
          <Label size="xs" weight="light">매우 작은 라이트 라벨</Label>
        </div>
      </div>
    </div>
  ),
}; 