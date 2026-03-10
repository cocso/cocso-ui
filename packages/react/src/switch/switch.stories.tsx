import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    position: { control: 'radio', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
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
    const [s1, setS1] = useState(false);
    const [s2, setS2] = useState(false);
    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Switch checked={s1} label="Small" onCheckedChange={setS1} size="sm" />
        <Switch checked={s2} label="Medium" onCheckedChange={setS2} size="md" />
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
        <Switch checked={l} label="왼쪽" onCheckedChange={setL} position="left" />
        <Switch checked={r} label="오른쪽" onCheckedChange={setR} position="right" />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Switch disabled label="비활성 off" onCheckedChange={() => {}} />
      <Switch checked disabled label="비활성 on" onCheckedChange={() => {}} />
    </div>
  ),
};
