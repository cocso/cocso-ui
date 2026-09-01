import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'error', 'warning', 'info', 'neutral', 'error-ghost'] },
    size: { control: 'select', options: ['large', 'medium', 'small', 'x-small'] },
    shape: { control: 'select', options: ['square', 'rounded', 'circle', 'sharp'] },
    align: { control: 'select', options: ['center', 'start', 'between'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    shape: 'square',
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
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
      <Button variant="error">Error</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="error-ghost">Error Ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button size="x-small">X-Small</Button>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="circle" svgOnly>◎</Button>
      <Button shape="sharp">Sharp</Button>
    </div>
  ),
};

export const Alignments: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '240px' }}>
      <Button align="center" style={{ width: '100%' }}>Center</Button>
      <Button align="start" shape="sharp" style={{ width: '100%' }} variant="neutral">
        Start (menu item)
      </Button>
      <Button align="between" style={{ width: '100%' }} suffix="›" variant="outline">
        Between
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button loading variant="primary">Primary</Button>
      <Button loading variant="secondary">Secondary</Button>
      <Button loading variant="outline">Outline</Button>
      <Button loading variant="ghost">Ghost</Button>
      <Button loading variant="success">Success</Button>
      <Button loading variant="error">Error</Button>
      <Button loading variant="warning">Warning</Button>
      <Button loading variant="info">Info</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button disabled variant="primary">Primary</Button>
      <Button disabled variant="secondary">Secondary</Button>
      <Button disabled variant="outline">Outline</Button>
      <Button disabled variant="ghost">Ghost</Button>
      <Button disabled variant="error">Error</Button>
    </div>
  ),
};
