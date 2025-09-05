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

export const Default: Story = {
  render: () => {
    const [status, setStatus] = useState<CheckboxStatus>('off');
    return <Checkbox status={status} onChange={setStatus} label="Default Checkbox" />;
  },
};

export const AllStates: Story = {
  render: () => {
    const [onState, setOnState] = useState<CheckboxStatus>('on');
    const [offState, setOffState] = useState<CheckboxStatus>('off');
    const [intermediateState, setIntermediateState] = useState<CheckboxStatus>('intermediate');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox status={onState} onChange={setOnState} label="Checked (On)" />
        <Checkbox status={offState} onChange={setOffState} label="Unchecked (Off)" />
        <Checkbox status={intermediateState} onChange={setIntermediateState} label="Intermediate" />
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [status, setStatus] = useState<CheckboxStatus>('on');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox size="sm" status={status} onChange={setStatus} label="Small" />
        <Checkbox size="md" status={status} onChange={setStatus} label="Medium" />
        <Checkbox size="lg" status={status} onChange={setStatus} label="Large" />
      </div>
    );
  },
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px' }}>Checkbox Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>States</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>State</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>off</td>
            <td style={{ padding: '8px' }}>체크되지 않음</td>
            <td style={{ padding: '8px' }}>
              <Checkbox status="off" onChange={() => {}} label="Off" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>on</td>
            <td style={{ padding: '8px' }}>체크됨</td>
            <td style={{ padding: '8px' }}>
              <Checkbox status="on" onChange={() => {}} label="On" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>intermediate</td>
            <td style={{ padding: '8px' }}>부분 선택</td>
            <td style={{ padding: '8px' }}>
              <Checkbox status="intermediate" onChange={() => {}} label="Intermediate" />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Dimensions</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>sm</td>
            <td style={{ padding: '8px' }}>32px</td>
            <td style={{ padding: '8px' }}>
              <Checkbox size="sm" status="on" onChange={() => {}} label="Small" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>md</td>
            <td style={{ padding: '8px' }}>36px</td>
            <td style={{ padding: '8px' }}>
              <Checkbox size="md" status="on" onChange={() => {}} label="Medium" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>lg</td>
            <td style={{ padding: '8px' }}>40px</td>
            <td style={{ padding: '8px' }}>
              <Checkbox size="lg" status="on" onChange={() => {}} label="Large" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox 컴포넌트의 모든 states와 sizes 스펙을 테이블로 보여줍니다.',
      },
    },
  },
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
