import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['primary', 'neutral', 'white'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner color="primary" />
      <Spinner color="neutral" />
      <div style={{ backgroundColor: '#333', padding: '8px', borderRadius: '4px' }}>
        <Spinner color="white" />
      </div>
    </div>
  ),
};
