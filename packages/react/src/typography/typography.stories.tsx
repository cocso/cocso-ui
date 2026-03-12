import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: { control: 'select', options: ['custom', 'body', 'heading'] },
    weight: { control: 'select', options: ['normal', 'medium', 'semibold', 'bold'] },
    color: { control: 'color' },
  },
  args: {
    children: '텍스트 샘플',
    type: 'body',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Body: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography size="large" type="body">Body Large</Typography>
      <Typography size="medium" type="body">Body Medium</Typography>
      <Typography size="small" type="body">Body Small</Typography>
      <Typography size="x-small" type="body">Body X-Small</Typography>
    </div>
  ),
};

export const Heading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography size="x-large" type="heading">Heading X-Large</Typography>
      <Typography size="large" type="heading">Heading Large</Typography>
      <Typography size="medium" type="heading">Heading Medium</Typography>
      <Typography size="small" type="heading">Heading Small</Typography>
      <Typography size="x-small" type="heading">Heading X-Small</Typography>
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
