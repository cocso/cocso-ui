import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, type CheckboxStatus } from './checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    status: 'off',
    onChange: () => {},
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [status, setStatus] = useState<CheckboxStatus>('off');
    return <Checkbox onChange={setStatus} status={status} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [status, setStatus] = useState<CheckboxStatus>('off');
    return <Checkbox label="동의합니다" onChange={setStatus} status={status} />;
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox label="Off" onChange={() => {}} status="off" />
      <Checkbox label="On" onChange={() => {}} status="on" />
      <Checkbox label="Intermediate" onChange={() => {}} status="intermediate" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => {
    const [s1, setS1] = useState<CheckboxStatus>('on');
    const [s2, setS2] = useState<CheckboxStatus>('on');
    const [s3, setS3] = useState<CheckboxStatus>('on');
    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Checkbox label="Small" onChange={setS1} size="sm" status={s1} />
        <Checkbox label="Medium" onChange={setS2} size="md" status={s2} />
        <Checkbox label="Large" onChange={setS3} size="lg" status={s3} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Checkbox disabled label="Disabled off" onChange={() => {}} status="off" />
      <Checkbox disabled label="Disabled on" onChange={() => {}} status="on" />
    </div>
  ),
};
