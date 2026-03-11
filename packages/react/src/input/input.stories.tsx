import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    stretch: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'] },
  },
  args: {
    size: 'medium',
    type: 'text',
    placeholder: '입력해주세요',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input size="small" placeholder="small" />
      <Input size="medium" placeholder="medium" />
      <Input size="large" placeholder="large" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input type="text" placeholder="text" />
      <Input type="password" placeholder="password" />
      <Input type="email" placeholder="email" />
      <Input type="number" placeholder="number" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Input disabled placeholder="비활성화" />
  ),
};

export const Stretch: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ width: '300px' }}>
      <Input stretch placeholder="전체 너비" />
    </div>
  ),
};
