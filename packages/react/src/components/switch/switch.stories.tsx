import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: ['primary', 'success', 'error', 'warning', 'info'] },
    position: { control: 'radio', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'medium',
    variant: 'primary',
    position: 'right',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} label="알림 사용" onCheckedChange={setChecked} />;
  },
};

export const Sizes: Story = {
  render: () => {
    const [s1, setS1] = useState(true);
    const [s2, setS2] = useState(true);
    const [s3, setS3] = useState(true);
    return (
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Switch checked={s1} label="Small" onCheckedChange={setS1} size="small" />
        <Switch checked={s2} label="Medium" onCheckedChange={setS2} size="medium" />
        <Switch checked={s3} label="Large" onCheckedChange={setS3} size="large" />
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const [v1, setV1] = useState(true);
    const [v2, setV2] = useState(true);
    const [v3, setV3] = useState(true);
    const [v4, setV4] = useState(true);
    const [v5, setV5] = useState(true);
    return (
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Switch checked={v1} label="Primary" onCheckedChange={setV1} variant="primary" />
        <Switch checked={v2} label="Success" onCheckedChange={setV2} variant="success" />
        <Switch checked={v3} label="Error" onCheckedChange={setV3} variant="error" />
        <Switch checked={v4} label="Warning" onCheckedChange={setV4} variant="warning" />
        <Switch checked={v5} label="Info" onCheckedChange={setV5} variant="info" />
      </div>
    );
  },
};

export const LabelPositions: Story = {
  render: () => {
    const [l, setL] = useState(false);
    const [r, setR] = useState(false);
    return (
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Switch checked={l} label="레이블 왼쪽" onCheckedChange={setL} position="left" />
        <Switch checked={r} label="레이블 오른쪽" onCheckedChange={setR} position="right" />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Switch disabled label="비활성 (꺼짐)" />
      <Switch checked disabled label="비활성 (켜짐)" />
    </div>
  ),
};
