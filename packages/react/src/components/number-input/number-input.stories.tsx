import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from '../input';
import { NumberInput, type NumberInputProps } from './number-input';

/** Holds the value so the story can be typed into; starts from a pinned number. */
function Stateful({ initial = null, ...props }: Omit<NumberInputProps, 'onValueChange' | 'value'> & { initial?: number | null }) {
  const [value, setValue] = useState<number | null>(initial);
  return <NumberInput {...props} onValueChange={setValue} value={value} />;
}

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
    maxFractionDigits: { control: 'number' },
    disabled: { control: 'boolean' },
    stretch: { control: 'boolean' },
  },
  args: {
    'aria-label': '금액',
    onValueChange: () => undefined,
    value: 1234567,
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '240px' }}>
      <Stateful aria-label="금액" initial={1234567} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ width: '240px' }}>
      <Stateful aria-label="금액" placeholder="금액" />
    </div>
  ),
};

/** Up to two decimal places, e.g. a rate. */
export const Decimal: Story = {
  render: () => (
    <div style={{ width: '240px' }}>
      <Stateful aria-label="수수료율" initial={12.5} maxFractionDigits={2} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Stateful description="부가세 포함 금액" initial={50000} label="정산 금액" />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Stateful error="금액은 필수 입력 항목입니다." label="정산 금액" placeholder="금액" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '240px' }}>
      <Stateful aria-label="금액" disabled initial={30000} />
    </div>
  ),
};

/** Same recipe, same box: the field lines up with a plain `Input` of the same size. */
export const BesideAnInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
      <Input aria-label="품목" defaultValue="코크소정" size="small" stretch />
      <Stateful aria-label="금액" initial={1500000} />
    </div>
  ),
};
