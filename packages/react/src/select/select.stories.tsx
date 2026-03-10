import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    size: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
    stretch: { control: 'boolean' },
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
      <Select size="2xs"><option>2XS</option></Select>
      <Select size="xs"><option>XS</option></Select>
      <Select size="sm"><option>SM</option></Select>
      <Select size="md"><option>MD</option></Select>
      <Select size="lg"><option>LG</option></Select>
      <Select size="xl"><option>XL</option></Select>
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
  render: () => (
    <div style={{ width: 300 }}>
      <Select stretch>
        <option value="1">옵션 1</option>
        <option value="2">옵션 2</option>
      </Select>
    </div>
  ),
};
