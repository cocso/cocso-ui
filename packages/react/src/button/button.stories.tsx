import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'neutral'],
    },
    size: { control: 'select', options: ['xl', 'lg', 'md', 'sm', 'xs'] },
    shape: { control: 'select', options: ['square', 'rounded', 'circle'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    svgOnly: { control: 'boolean' },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="success">Success</Button>
      <Button variant="error">Error</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="neutral">Neutral</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button disabled variant="primary">Primary</Button>
      <Button disabled variant="secondary">Secondary</Button>
      <Button disabled variant="tertiary">Tertiary</Button>
      <Button disabled variant="error">Error</Button>
    </div>
  ),
};
