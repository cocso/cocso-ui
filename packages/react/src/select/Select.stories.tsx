import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Select 컴포넌트는 드롭다운 선택 목록을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: '셀렉트 크기',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'SelectSize' },
      },
    },
    disabled: {
      description: '비활성화 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Select 사용법입니다.' } },
  },
  render: () => (
    <Select>
      <option value="">선택하세요</option>
      <option value="option1">옵션 1</option>
      <option value="option2">옵션 2</option>
      <option value="option3">옵션 3</option>
    </Select>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 사이즈를 비교합니다.' } },
  },
  render: () => (
    <div style={columnStyle}>
      <Select size="xs">
        <option value="">XS</option>
        <option value="1">옵션 1</option>
      </Select>
      <Select size="sm">
        <option value="">SM</option>
        <option value="1">옵션 1</option>
      </Select>
      <Select size="md">
        <option value="">MD</option>
        <option value="1">옵션 1</option>
      </Select>
      <Select size="lg">
        <option value="">LG</option>
        <option value="1">옵션 1</option>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '비활성화 상태를 보여줍니다.' } },
  },
  render: () => (
    <Select disabled>
      <option value="">비활성화됨</option>
      <option value="1">옵션 1</option>
    </Select>
  ),
};

export const Playground: Story = {
  args: {
    size: 'md',
    disabled: false,
  },
  render: args => (
    <Select {...args}>
      <option value="">선택하세요</option>
      <option value="option1">옵션 1</option>
      <option value="option2">옵션 2</option>
      <option value="option3">옵션 3</option>
    </Select>
  ),
};
