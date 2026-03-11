import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    size: { control: 'select', options: ['2x-small', 'x-small', 'small', 'medium', 'large', 'x-large'] },
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
      <Select size="2x-small"><option>2X-Small</option></Select>
      <Select size="x-small"><option>X-Small</option></Select>
      <Select size="small"><option>Small</option></Select>
      <Select size="medium"><option>Medium</option></Select>
      <Select size="large"><option>Large</option></Select>
      <Select size="x-large"><option>X-Large</option></Select>
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
