import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Typography 컴포넌트는 일관된 텍스트 스타일링을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '텍스트 내용',
      control: 'text',
    },
    type: {
      description: '타이포그래피 타입',
      control: 'select',
      options: ['custom', 'body', 'display', 'heading'],
      table: {
        defaultValue: { summary: 'custom' },
        type: { summary: "'custom' | 'body' | 'display' | 'heading'" },
      },
    },
    size: {
      description: '크기 (타입에 따라 다름)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string | number | ResponsiveFontSize' },
      },
    },
    weight: {
      description: '폰트 굵기',
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
      table: {
        defaultValue: { summary: 'normal' },
        type: { summary: 'FontWeight' },
      },
    },
    color: {
      description: '텍스트 색상',
      control: 'color',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Display</h4>
        <Typography size="lg" type="display">
          Display Large
        </Typography>
        <Typography size="md" type="display">
          Display Medium
        </Typography>
        <Typography size="sm" type="display">
          Display Small
        </Typography>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Heading</h4>
        <Typography size="xl" type="heading">
          Heading XL
        </Typography>
        <Typography size="lg" type="heading">
          Heading Large
        </Typography>
        <Typography size="md" type="heading">
          Heading Medium
        </Typography>
        <Typography size="sm" type="heading">
          Heading Small
        </Typography>
        <Typography size="xs" type="heading">
          Heading XS
        </Typography>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Body</h4>
        <Typography size="lg" type="body">
          Body Large
        </Typography>
        <Typography size="md" type="body">
          Body Medium
        </Typography>
        <Typography size="sm" type="body">
          Body Small
        </Typography>
        <Typography size="xs" type="body">
          Body XS
        </Typography>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Custom</h4>
        <Typography size={24} type="custom">
          Custom 24px
        </Typography>
        <Typography size={18} type="custom">
          Custom 18px
        </Typography>
        <Typography size={14} type="custom">
          Custom 14px
        </Typography>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Typography',
    type: 'custom',
    size: 16,
    weight: 'normal',
    color: '#000000',
  },
};
