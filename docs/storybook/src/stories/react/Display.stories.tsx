import type { Meta, StoryObj } from '@storybook/react';
import { Display } from '@cocso-ui/react';

const meta = {
  title: 'react/display',
  component: Display,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm'],
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
} satisfies Meta<typeof Display>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '동해물과 백두산이 마르고 닳도록',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Display size="lg">동해물과 백두산이 마르고 닳도록</Display>
          <Display size="md">하느님이 보우하사 우리나라 만세</Display>
          <Display size="sm">무궁화 삼천리 화려강산</Display>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Hero Section Example
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          <Display asChild size="lg" color="#1F2937">
            <h1>다람쥐 헌 챗바퀴에 타고파</h1>
          </Display>
          <Display asChild size="md" color="#6B7280">
            <h2>까치 까치 까치 까치 까치 까치 까치 까치 까치 까치</h2>
          </Display>
          <Display asChild size="sm" color="#9CA3AF">
            <h3>토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼</h3>
          </Display>
        </div>
      </div>
    </div>
  ),
};
