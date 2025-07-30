import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '@cocso-ui/react';

const meta = {
  title: 'react/checkbox',
  component: Checkbox,
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
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: ['on', 'off', 'intermediate'],
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-checkbox',
    size: 'md',
    status: 'off',
    label: '기본 체크박스',
    disabled: false,
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    id: 'checked-checkbox',
    status: 'on',
    label: '체크된 체크박스',
    disabled: false,
    onChange: () => {},
  },
};

export const Intermediate: Story = {
  args: {
    id: 'intermediate-checkbox',
    status: 'intermediate',
    label: '중간 상태 체크박스',
    disabled: false,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-checkbox',
    status: 'off',
    label: '비활성화된 체크박스',
    disabled: true,
    onChange: () => {},
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-checkbox',
    status: 'on',
    label: '비활성화된 체크된 체크박스',
    disabled: true,
    onChange: () => {},
  },
};

export const AllVariations: Story = {
  args: {
    id: 'all-variations',
    status: 'off',
    onChange: () => {},
  },
  render: () => {
    const [states, setStates] = useState({
      sm: 'off',
      md: 'off',
      lg: 'off',
    });

    const handleChange = (size: 'sm' | 'md' | 'lg') => (next: any) => {
      setStates(prev => ({ ...prev, [size]: next }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Checkbox
              id="size-sm"
              size="sm"
              status={states.sm as any}
              onChange={handleChange('sm')}
              label="작은 크기 (sm)"
            />
            <Checkbox
              id="size-md"
              size="md"
              status={states.md as any}
              onChange={handleChange('md')}
              label="중간 크기 (md)"
            />
            <Checkbox
              id="size-lg"
              size="lg"
              status={states.lg as any}
              onChange={handleChange('lg')}
              label="큰 크기 (lg)"
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>States</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Checkbox
              id="state-off"
              status="off"
              onChange={() => {}}
              label="해제 상태 (off)"
            />
            <Checkbox
              id="state-on"
              status="on"
              onChange={() => {}}
              label="체크 상태 (on)"
            />
            <Checkbox
              id="state-intermediate"
              status="intermediate"
              onChange={() => {}}
              label="중간 상태 (intermediate)"
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Disabled States</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Checkbox
              id="disabled-off"
              status="off"
              onChange={() => {}}
              disabled
              label="비활성화된 해제 상태"
            />
            <Checkbox
              id="disabled-on"
              status="on"
              onChange={() => {}}
              disabled
              label="비활성화된 체크 상태"
            />
            <Checkbox
              id="disabled-intermediate"
              status="intermediate"
              onChange={() => {}}
              disabled
              label="비활성화된 중간 상태"
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Without Label</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Checkbox
              id="no-label-off"
              status="off"
              onChange={() => {}}
            />
            <Checkbox
              id="no-label-on"
              status="on"
              onChange={() => {}}
            />
            <Checkbox
              id="no-label-intermediate"
              status="intermediate"
              onChange={() => {}}
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
    status: 'off',
    onChange: () => {},
  },
  render: () => {
    const [checkboxes, setCheckboxes] = useState({
      item1: 'off',
      item2: 'off',
      item3: 'off',
    });

    const handleChange = (key: string) => (next: any) => {
      setCheckboxes(prev => ({ ...prev, [key]: next }));
    };

    const allChecked = Object.values(checkboxes).every(status => status === 'on');
    const someChecked = Object.values(checkboxes).some(status => status === 'on') && !allChecked;

    const handleSelectAll = () => {
      const newStatus = allChecked ? 'off' : 'on';
      setCheckboxes({
        item1: newStatus,
        item2: newStatus,
        item3: newStatus,
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
          체크박스 그룹 예제
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Checkbox
            id="select-all"
            status={(allChecked ? 'on' : someChecked ? 'intermediate' : 'off') as any}
            onChange={handleSelectAll}
            label="전체 선택"
          />
        </div>

        <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Checkbox
            id="item-1"
            status={checkboxes.item1 as any}
            onChange={handleChange('item1')}
            label="항목 1"
          />
          <Checkbox
            id="item-2"
            status={checkboxes.item2 as any}
            onChange={handleChange('item2')}
            label="항목 2"
          />
          <Checkbox
            id="item-3"
            status={checkboxes.item3 as any}
            onChange={handleChange('item3')}
            label="항목 3"
          />
        </div>
      </div>
    );
  },
};
