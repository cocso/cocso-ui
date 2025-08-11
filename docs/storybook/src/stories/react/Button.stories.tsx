import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@cocso-ui/react';

const meta = {
  title: 'react/button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'success', 'text'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs', '2xs'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    color: {
      control: 'color',
    },
    weight: {
      control: 'select',
      options: [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'primary',
    children: '동일 성분 검색',
    disabled: false,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: '저장하기',
    loading: true,
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary">primary</Button>
          <Button variant="secondary">secondary</Button>
          <Button variant="tertiary">tertiary</Button>
          <Button variant="danger">danger</Button>
          <Button variant="success">success</Button>
          <Button variant="text">text</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xl">대형 버튼</Button>
          <Button size="lg">큰 버튼</Button>
          <Button size="md">중간 버튼</Button>
          <Button size="sm">작은 버튼</Button>
          <Button size="xs">매우 작은 버튼</Button>
          <Button size="2xs">최소 버튼</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>States</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button>정상</Button>
          <Button disabled>비활성화</Button>
          <Button loading>로딩 중</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Font Weights</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button weight="thin">Thin</Button>
          <Button weight="extralight">Extra Light</Button>
          <Button weight="light">Light</Button>
          <Button weight="normal">Normal</Button>
          <Button weight="medium">Medium</Button>
          <Button weight="semibold">Semibold</Button>
          <Button weight="bold">Bold</Button>
          <Button weight="extrabold">Extra Bold</Button>
          <Button weight="black">Black</Button>
        </div>
      </div>
    </div>
  ),
};
