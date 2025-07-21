import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@cocso-ui/react';

const meta = {
  title: 'React/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs', '2xs'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    disabled: false,
    children: [
      <option key="" value="">옵션을 선택하세요</option>,
      <option key="1" value="option1">사과</option>,
      <option key="2" value="option2">바나나</option>,
      <option key="3" value="option3">포도</option>,
      <option key="4" value="option4">오렌지</option>,
    ],
  },
  render: (args) => (
    <div>
      <label htmlFor="default-select" style={{ display: 'block', marginBottom: 8 }}>과일 선택</label>
      <Select id="default-select" {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    size: 'md',
    disabled: true,
    children: [
      <option key="" value="">옵션을 선택하세요</option>,
      <option key="1" value="option1">사과</option>,
      <option key="2" value="option2">바나나</option>,
      <option key="3" value="option3">포도</option>,
      <option key="4" value="option4">오렌지</option>,
    ],
  },
  render: (args) => (
    <div>
      <label htmlFor="disabled-select" style={{ display: 'block', marginBottom: 8 }}>비활성화 예시</label>
      <Select id="disabled-select" {...args} />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
      <div>
        <label htmlFor="select-xl" style={{ display: 'block', marginBottom: 8 }}>XL 사이즈</label>
        <Select id="select-xl" size="xl">
          <option value="">옵션을 선택하세요</option>
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="orange">오렌지</option>
        </Select>
      </div>
      <div>
        <label htmlFor="select-lg" style={{ display: 'block', marginBottom: 8 }}>Large 사이즈</label>
        <Select id="select-lg" size="lg">
          <option value="">옵션을 선택하세요</option>
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="orange">오렌지</option>
        </Select>
      </div>
      <div>
        <label htmlFor="select-md" style={{ display: 'block', marginBottom: 8 }}>Medium 사이즈</label>
        <Select id="select-md" size="md">
          <option value="">옵션을 선택하세요</option>
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="orange">오렌지</option>
        </Select>
      </div>
      <div>
        <label htmlFor="select-sm" style={{ display: 'block', marginBottom: 8 }}>Small 사이즈</label>
        <Select id="select-sm" size="sm">
          <option value="">옵션을 선택하세요</option>
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="orange">오렌지</option>
        </Select>
      </div>
      <div>
        <label htmlFor="select-xs" style={{ display: 'block', marginBottom: 8 }}>Extra Small 사이즈</label>
        <Select id="select-xs" size="xs">
          <option value="">옵션을 선택하세요</option>
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="orange">오렌지</option>
        </Select>
      </div>
      <div>
        <label htmlFor="select-2xs" style={{ display: 'block', marginBottom: 8 }}>2XS 사이즈</label>
        <Select id="select-2xs" size="2xs">
          <option value="">옵션을 선택하세요</option>
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="orange">오렌지</option>
        </Select>
      </div>
    </div>
  ),
}; 