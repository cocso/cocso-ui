import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Switch 컴포넌트는 사용자가 설정을 켜거나 끌 수 있는 토글 스위치입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      description: '스위치의 체크 상태',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onCheckedChange: {
      description: '스위치 상태 변경 시 호출되는 함수',
      action: 'changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
      },
    },
    size: {
      description: '스위치의 크기',
      control: 'select',
      options: ['sm', 'md'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'SwitchSize' },
      },
    },
    label: {
      description: '스위치 라벨 텍스트',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    position: {
      description: '라벨의 위치',
      control: 'select',
      options: ['left', 'right'],
      table: {
        defaultValue: { summary: 'right' },
        type: { summary: "'left' | 'right'" },
      },
    },
    disabled: {
      description: '스위치 비활성화 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Switch 사용법입니다.' } },
  },
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} label="Switch" />;
  },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 사이즈를 비교합니다.' } },
  },
  render: () => {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);

    return (
      <div style={columnStyle}>
        <Switch size="sm" checked={sm} onCheckedChange={setSm} label="Small" />
        <Switch size="md" checked={md} onCheckedChange={setMd} label="Medium" />
      </div>
    );
  },
};

export const LabelPositions: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '라벨 위치(left, right)를 비교합니다.' } },
  },
  render: () => {
    const [right, setRight] = useState(true);
    const [left, setLeft] = useState(true);

    return (
      <div style={columnStyle}>
        <Switch checked={right} onCheckedChange={setRight} label="Label on Right" position="right" />
        <Switch checked={left} onCheckedChange={setLeft} label="Label on Left" position="left" />
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
      <Switch checked onChange={() => {}} label="Disabled On" disabled />
      <Switch checked={false} onChange={() => {}} label="Disabled Off" disabled />
    </div>
  ),
};

export const Playground: Story = {
  render: args => {
    const [checked, setChecked] = useState(args.checked || false);
    return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
  },
  args: {
    checked: false,
    label: 'Switch',
    size: 'md',
    position: 'right',
    disabled: false,
  },
};
