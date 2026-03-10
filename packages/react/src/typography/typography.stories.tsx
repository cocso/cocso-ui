import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  argTypes: {
    type: { control: 'select', options: ['custom', 'body', 'heading', 'display'] },
    weight: { control: 'select', options: ['normal', 'medium', 'semibold', 'bold'] },
    color: { control: 'color' },
  },
  args: {
    children: '텍스트',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Body: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography size="lg" type="body">Body Large</Typography>
      <Typography size="md" type="body">Body Medium</Typography>
      <Typography size="sm" type="body">Body Small</Typography>
      <Typography size="xs" type="body">Body XS</Typography>
    </div>
  ),
};

export const Heading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography size="xl" type="heading">Heading XL</Typography>
      <Typography size="lg" type="heading">Heading Large</Typography>
      <Typography size="md" type="heading">Heading Medium</Typography>
      <Typography size="sm" type="heading">Heading Small</Typography>
      <Typography size="xs" type="heading">Heading XS</Typography>
    </div>
  ),
};

export const Display: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography size="lg" type="display">Display Large</Typography>
      <Typography size="md" type="display">Display Medium</Typography>
      <Typography size="sm" type="display">Display Small</Typography>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography type="body" weight="normal">Normal weight</Typography>
      <Typography type="body" weight="medium">Medium weight</Typography>
      <Typography type="body" weight="semibold">Semibold weight</Typography>
      <Typography type="body" weight="bold">Bold weight</Typography>
    </div>
  ),
};
