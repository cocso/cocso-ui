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
      options: ['md', 'lg'],
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

export const AllVariants: Story = {
  render: () => {
    const [state1, setState1] = useState(true);
    const [state2, setState2] = useState(false);
    const [state3, setState3] = useState(true);
    const [state4, setState4] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Sizes</h4>
          <Switch size="md" checked={state1} onCheckedChange={setState1} label="Medium" />
          <Switch size="lg" checked={state2} onCheckedChange={setState2} label="Large" />
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
            Label Positions
          </h4>
          <Switch
            checked={state3}
            onCheckedChange={setState3}
            label="Label on Right"
            position="right"
          />
          <Switch
            checked={state4}
            onCheckedChange={setState4}
            label="Label on Left"
            position="left"
          />
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Disabled</h4>
          <Switch checked onChange={() => {}} label="Disabled On" disabled />
          <Switch checked={false} onChange={() => {}} label="Disabled Off" disabled />
        </div>
      </div>
    );
  },
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
