import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from '../input';
import { SegmentedControl, type SegmentedControlProps } from './segmented-control';

const PERIOD_OPTIONS = [
  { value: 'day', label: '일별' },
  { value: 'week', label: '주별' },
  { value: 'month', label: '월별' },
] as const;

type Period = (typeof PERIOD_OPTIONS)[number]['value'];

/** Holds the value so a story can be clicked through; starts from a pinned option. */
function Stateful(props: Omit<SegmentedControlProps<Period>, 'onChange' | 'options' | 'value'> & {
  initial?: Period;
}) {
  const { initial = 'week', ...rest } = props;
  const [value, setValue] = useState<string>(initial);
  return <SegmentedControl {...rest} onChange={setValue} options={PERIOD_OPTIONS} value={value} />;
}

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['medium', 'small'] },
    disabled: { control: 'boolean' },
    fitContent: { control: 'boolean' },
  },
  args: {
    'aria-label': '집계 기간',
    onChange: () => undefined,
    options: PERIOD_OPTIONS,
    value: 'week',
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <Stateful aria-label="집계 기간" />
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <Stateful aria-label="집계 기간" size="small" />
    </div>
  ),
};

/** Each segment is as wide as its label; the indicator follows the selected one. */
export const FitContent: Story = {
  render: () => (
    <SegmentedControl
      aria-label="정산 방식"
      fitContent
      onChange={() => undefined}
      options={[
        { value: 'sum', label: '합산' },
        { value: 'separate', label: '처방월별 개별 정산' },
        { value: 'none', label: '없음' },
      ]}
      value="separate"
    />
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <div style={{ width: '360px' }}>
      <SegmentedControl
        aria-label="수수료 계산"
        description="저장 후 다음 정산부터 적용됩니다."
        onChange={() => undefined}
        options={[
          { value: 'rate', label: '비율', description: '처방액 기준 %' },
          { value: 'amount', label: '정액', description: '건당 고정 금액' },
        ]}
        value="rate"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <Stateful aria-label="집계 기간" description="기간 설정 권한이 없습니다." disabled />
    </div>
  ),
};

/** `medium` stands as tall as a `small` Input, `small` as an `x-small` one. */
export const BesideAnInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Input aria-label="거래처" defaultValue="코크소" size="small" />
        <Stateful aria-label="집계 기간" fitContent />
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Input aria-label="검색어" defaultValue="정산" size="x-small" />
        <Stateful aria-label="검색 기간" fitContent size="small" />
      </div>
    </div>
  ),
};
