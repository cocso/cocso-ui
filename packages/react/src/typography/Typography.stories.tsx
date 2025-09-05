import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

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
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Display</h4>
        <Typography type="display" size="lg">
          Display Large
        </Typography>
        <Typography type="display" size="md">
          Display Medium
        </Typography>
        <Typography type="display" size="sm">
          Display Small
        </Typography>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Heading</h4>
        <Typography type="heading" size="xl">
          Heading XL
        </Typography>
        <Typography type="heading" size="lg">
          Heading Large
        </Typography>
        <Typography type="heading" size="md">
          Heading Medium
        </Typography>
        <Typography type="heading" size="sm">
          Heading Small
        </Typography>
        <Typography type="heading" size="xs">
          Heading XS
        </Typography>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Body</h4>
        <Typography type="body" size="lg">
          Body Large
        </Typography>
        <Typography type="body" size="md">
          Body Medium
        </Typography>
        <Typography type="body" size="sm">
          Body Small
        </Typography>
        <Typography type="body" size="xs">
          Body XS
        </Typography>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Custom</h4>
        <Typography type="custom" size={24}>
          Custom 24px
        </Typography>
        <Typography type="custom" size={18}>
          Custom 18px
        </Typography>
        <Typography type="custom" size={14}>
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
