import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from '@cocso-ui/react';

const meta = {
  title: 'React/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    checked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-switch',
    size: 'md',
    disabled: false,
    label: '기본 스위치',
    labelPosition: 'right',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    id: 'checked-switch',
    size: 'md',
    disabled: false,
    label: '켜진 스위치',
    labelPosition: 'right',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-switch',
    size: 'md',
    disabled: true,
    label: '비활성화된 스위치',
    labelPosition: 'right',
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-switch',
    size: 'md',
    disabled: true,
    label: '비활성화된 켜진 스위치',
    labelPosition: 'right',
    checked: true,
  },
};

export const LabelLeft: Story = {
  args: {
    id: 'label-left-switch',
    size: 'md',
    disabled: false,
    label: '라벨이 왼쪽에 있는 스위치',
    labelPosition: 'left',
    checked: false,
  },
};

export const AllVariations: Story = {
  args: {
    id: 'all-variations',
    checked: false,
  },
  render: () => {
    const [states, setStates] = useState({
      md: false,
      lg: false,
    });

    const handleChange = (size: 'md' | 'lg') => (checked: boolean) => {
      setStates(prev => ({ ...prev, [size]: checked }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* All Sizes */}
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
              id="size-md"
              size="md"
              checked={states.md}
              onCheckedChange={handleChange('md')}
              label="중간 크기 (md)"
            />
            <Switch
              id="size-lg"
              size="lg"
              checked={states.lg}
              onCheckedChange={handleChange('lg')}
              label="큰 크기 (lg)"
            />
          </div>
        </div>

        {/* All States */}
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>States</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
              id="state-off"
              checked={false}
              onCheckedChange={() => {}}
              label="해제 상태"
            />
            <Switch
              id="state-on"
              checked={true}
              onCheckedChange={() => {}}
              label="켜진 상태"
            />
          </div>
        </div>

        {/* Disabled States */}
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Disabled States</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
              id="disabled-off"
              checked={false}
              onCheckedChange={() => {}}
              disabled
              label="비활성화된 해제 상태"
            />
            <Switch
              id="disabled-on"
              checked={true}
              onCheckedChange={() => {}}
              disabled
              label="비활성화된 켜진 상태"
            />
          </div>
        </div>

        {/* Label Positions */}
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Label Positions</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
              id="label-left"
              checked={false}
              onCheckedChange={() => {}}
              label="라벨이 왼쪽"
              labelPosition="left"
            />
            <Switch
              id="label-right"
              checked={false}
              onCheckedChange={() => {}}
              label="라벨이 오른쪽"
              labelPosition="right"
            />
          </div>
        </div>

        {/* Without Label */}
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Without Label</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch
              id="no-label-off"
              checked={false}
              onCheckedChange={() => {}}
            />
            <Switch
              id="no-label-on"
              checked={true}
              onCheckedChange={() => {}}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const InteractiveExample: Story = {
  args: {
    id: 'interactive-example',
    checked: false,
  },
  render: () => {
    const [switches, setSwitches] = useState({
      notifications: false,
      darkMode: true,
      autoSave: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setSwitches(prev => ({ ...prev, [key]: checked }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
          설정 예제
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Switch
            id="notifications"
            checked={switches.notifications}
            onCheckedChange={handleChange('notifications')}
            label="푸시 알림"
            labelPosition="left"
          />
          <Switch
            id="dark-mode"
            checked={switches.darkMode}
            onCheckedChange={handleChange('darkMode')}
            label="다크 모드"
            labelPosition="left"
          />
          <Switch
            id="auto-save"
            checked={switches.autoSave}
            onCheckedChange={handleChange('autoSave')}
            label="자동 저장"
            labelPosition="left"
          />
        </div>

        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            현재 설정 상태:
          </p>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
            <li>푸시 알림: {switches.notifications ? '켜짐' : '꺼짐'}</li>
            <li>다크 모드: {switches.darkMode ? '켜짐' : '꺼짐'}</li>
            <li>자동 저장: {switches.autoSave ? '켜짐' : '꺼짐'}</li>
          </ul>
        </div>
      </div>
    );
  },
}; 