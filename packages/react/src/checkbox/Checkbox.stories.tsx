import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, type CheckboxStatus } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox 컴포넌트는 사용자가 옵션을 선택할 수 있는 체크박스입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      description: '체크박스의 상태',
      control: 'select',
      options: ['on', 'off', 'intermediate'],
      table: {
        type: { summary: 'CheckboxStatus' },
      },
    },
    onChange: {
      description: '체크박스 상태 변경 시 호출되는 함수',
      action: 'changed',
      table: {
        type: { summary: '(status: CheckboxStatus) => void' },
      },
    },
    size: {
      description: '체크박스의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'CheckboxSize' },
      },
    },
    label: {
      description: '체크박스 라벨 텍스트',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      description: '체크박스 비활성화 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Checkbox 사용법입니다.' } },
  },
  render: () => {
    const [status, setStatus] = useState<CheckboxStatus>('off');
    return <Checkbox status={status} onChange={setStatus} label="Checkbox" />;
  },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 사이즈를 비교합니다.' } },
  },
  render: () => (
    <div style={columnStyle}>
      <Checkbox size="sm" status="on" onChange={() => {}} label="Small" />
      <Checkbox size="md" status="on" onChange={() => {}} label="Medium" />
      <Checkbox size="lg" status="on" onChange={() => {}} label="Large" />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'on, off, intermediate 세 가지 상태를 비교합니다.' } },
  },
  render: () => {
    const [onState, setOnState] = useState<CheckboxStatus>('on');
    const [offState, setOffState] = useState<CheckboxStatus>('off');
    const [intermediateState, setIntermediateState] = useState<CheckboxStatus>('intermediate');

    return (
      <div style={columnStyle}>
        <Checkbox status={onState} onChange={setOnState} label="Checked (On)" />
        <Checkbox status={offState} onChange={setOffState} label="Unchecked (Off)" />
        <Checkbox status={intermediateState} onChange={setIntermediateState} label="Intermediate" />
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '비활성화 상태를 보여줍니다.' } },
  },
  render: () => (
    <div style={columnStyle}>
      <Checkbox status="on" onChange={() => {}} label="Disabled Checked" disabled />
      <Checkbox status="off" onChange={() => {}} label="Disabled Unchecked" disabled />
    </div>
  ),
};

export const Playground: Story = {
  render: args => {
    const [status, setStatus] = useState<CheckboxStatus>(args.status || 'off');
    return <Checkbox {...args} status={status} onChange={setStatus} />;
  },
  args: {
    status: 'off',
    label: 'Playground Checkbox',
    size: 'md',
    disabled: false,
  },
};
