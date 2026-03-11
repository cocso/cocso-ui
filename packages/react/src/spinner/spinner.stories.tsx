import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', 'x-large'] },
    color: { control: 'select', options: ['primary', 'neutral', 'white'] },
  },
  args: {
    size: 'medium',
    color: 'primary',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
      <Spinner size="x-large" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner color="primary" />
      <Spinner color="neutral" />
      <div style={{ backgroundColor: '#1e2124', padding: '8px', borderRadius: '6px' }}>
        <Spinner color="white" />
      </div>
    </div>
  ),
};
