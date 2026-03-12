import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    error: { control: 'text', description: 'true(시각 효과만) 또는 에러 메시지 문자열' },
    label: { control: 'text' },
    description: { control: 'text' },
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

export const WithLabel: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Select label="카테고리" stretch>
        <option value="1">옵션 1</option>
        <option value="2">옵션 2</option>
      </Select>
      <Select label="지역" description="배송 가능 지역을 선택하세요" stretch>
        <option value="seoul">서울</option>
        <option value="busan">부산</option>
      </Select>
      <Select label="배송 방법" error="배송 방법을 선택해주세요" stretch>
        <option value="">선택하세요</option>
        <option value="standard">일반 배송</option>
        <option value="express">빠른 배송</option>
      </Select>
      <Select label="옵션" required={false} stretch>
        <option value="1">선택 1</option>
        <option value="2">선택 2</option>
      </Select>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Select size="x-small"><option>x-small</option></Select>
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

export const Error: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Select error>
        <option value="1">시각 에러 (boolean)</option>
      </Select>
      <Select error="항목을 선택해주세요" label="카테고리">
        <option value="">선택하세요</option>
        <option value="1">옵션 1</option>
      </Select>
    </div>
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
