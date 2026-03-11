import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'success', 'error', 'warning'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    shape: { control: 'select', options: ['square', 'rounded', 'circle'] },
  },
  args: {
    children: 'Badge',
    variant: 'secondary',
    size: 'medium',
    shape: 'square',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge shape="square">Square</Badge>
      <Badge shape="rounded">Rounded</Badge>
      <Badge shape="circle">●</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="small">small</Badge>
      <Badge size="medium">medium</Badge>
      <Badge size="large">large</Badge>
    </div>
  ),
};
