import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    stretch: { control: 'boolean' },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Select {...args}>
      <option value="1">옵션 1</option>
      <option value="2">옵션 2</option>
      <option value="3">옵션 3</option>
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Select size="small"><option>small</option></Select>
      <Select size="medium"><option>medium</option></Select>
      <Select size="large"><option>large</option></Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <option>비활성화</option>
    </Select>
  ),
};

export const Stretch: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ width: '300px' }}>
      <Select stretch>
        <option value="1">옵션 1</option>
        <option value="2">옵션 2</option>
      </Select>
    </div>
  ),
};
