import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, type CheckboxStatus } from './checkbox';

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

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const [onState, setOnState] = useState<CheckboxStatus>('on');
    const [offState, setOffState] = useState<CheckboxStatus>('off');
    const [intermediateState, setIntermediateState] = useState<CheckboxStatus>('intermediate');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>States</h4>
          <Checkbox label="Checked (On)" onChange={setOnState} status={onState} />
          <Checkbox label="Unchecked (Off)" onChange={setOffState} status={offState} />
          <Checkbox
            label="Intermediate"
            onChange={setIntermediateState}
            status={intermediateState}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Sizes</h4>
          <Checkbox label="Small" onChange={() => {}} size="sm" status="on" />
          <Checkbox label="Medium" onChange={() => {}} size="md" status="on" />
          <Checkbox label="Large" onChange={() => {}} size="lg" status="on" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Disabled</h4>
          <Checkbox disabled label="Disabled Checked" onChange={() => {}} status="on" />
          <Checkbox disabled label="Disabled Unchecked" onChange={() => {}} status="off" />
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  render: args => {
    const [status, setStatus] = useState<CheckboxStatus>(args.status || 'off');

    return <Checkbox {...args} onChange={setStatus} status={status} />;
  },
  args: {
    status: 'off',
    label: 'Playground Checkbox',
    size: 'md',
    disabled: false,
  },
};
