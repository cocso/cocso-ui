import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    error: { control: 'text', description: 'true(시각 효과만) 또는 에러 메시지 문자열' },
    label: { control: 'text' },
    description: { control: 'text' },
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

export const WithLabel: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Input label="이름" placeholder="이름을 입력하세요" stretch />
      <Input label="비밀번호" type="password" description="8자 이상 입력하세요" placeholder="비밀번호" stretch />
      <Input label="이메일" error="올바른 이메일 주소를 입력하세요" placeholder="이메일" stretch />
      <Input label="닉네임" required={false} placeholder="선택 입력" stretch />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input size="x-small" placeholder="x-small" />
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

export const Error: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input error placeholder="시각 에러 (boolean)" />
      <Input error="이메일 형식이 올바르지 않습니다" label="이메일" placeholder="이메일" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Input readOnly value="읽기 전용" />
  ),
};
