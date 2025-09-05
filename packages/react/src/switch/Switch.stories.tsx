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

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} label="Default Switch" />;
  },
};

export const AllSizes: Story = {
  render: () => {
    const [mdChecked, setMdChecked] = useState(true);
    const [lgChecked, setLgChecked] = useState(true);

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}
      >
        <Switch size="md" checked={mdChecked} onCheckedChange={setMdChecked} label="Medium" />
        <Switch size="lg" checked={lgChecked} onCheckedChange={setLgChecked} label="Large" />
      </div>
    );
  },
};

export const LabelPositions: Story = {
  render: () => {
    const [leftChecked, setLeftChecked] = useState(true);
    const [rightChecked, setRightChecked] = useState(true);

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}
      >
        <Switch
          checked={leftChecked}
          onCheckedChange={setLeftChecked}
          label="Label on Left"
          position="left"
        />
        <Switch
          checked={rightChecked}
          onCheckedChange={setRightChecked}
          label="Label on Right"
          position="right"
        />
      </div>
    );
  },
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px' }}>Switch Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Width × Height</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Thumb Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>md</td>
            <td style={{ padding: '8px' }}>48px × 36px</td>
            <td style={{ padding: '8px' }}>32px</td>
            <td style={{ padding: '8px' }}>
              <Switch size="md" checked onChange={() => {}} label="Medium" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>lg</td>
            <td style={{ padding: '8px' }}>56px × 40px</td>
            <td style={{ padding: '8px' }}>36px</td>
            <td style={{ padding: '8px' }}>
              <Switch size="lg" checked onChange={() => {}} label="Large" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Switch 컴포넌트의 모든 sizes 스펙을 테이블로 보여줍니다.',
      },
    },
  },
};

export const Playground: Story = {
  render: args => {
    const [checked, setChecked] = useState(args.checked || false);

    return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
  },
  args: {
    checked: false,
    label: 'Playground Switch',
    size: 'md',
    position: 'right',
    disabled: false,
  },
};
