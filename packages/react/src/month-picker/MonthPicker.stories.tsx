import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Select } from '../select';
import { MonthPicker } from './MonthPicker';

const meta: Meta<typeof MonthPicker> = {
  title: 'Components/MonthPicker',
  component: MonthPicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '월을 선택할 수 있는 컴포넌트입니다. Dropdown 컴포넌트를 기반으로 구현되어 일관된 사용자 경험을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    minYear: {
      control: { type: 'number' },
      description: '선택 가능한 최소 년도',
    },
    maxYear: {
      control: { type: 'number' },
      description: '선택 가능한 최대 년도',
    },
    value: {
      control: { type: 'date' },
      description: '선택된 값 (Date)',
    },
    onValueChange: {
      action: 'onValueChange',
      description: '값이 변경될 때 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const MONTHS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const formatValue = (value: Date | undefined) => {
  if (!value) {
    return '월을 선택하세요';
  }
  return `${value.getFullYear()}년 ${MONTHS[value.getMonth()]}`;
};

// 기본 사용법
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <MonthPicker value={value} onValueChange={setValue}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </MonthPicker>

        {value && (
          <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
        )}
      </div>
    );
  },
};

// 다양한 버튼 스타일
export const ButtonVariants: Story = {
  render: () => {
    const [value1, setValue1] = useState<Date | undefined>();
    const [value2, setValue2] = useState<Date | undefined>();
    const [value3, setValue3] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <MonthPicker value={value1} onValueChange={setValue1}>
          <Button variant="primary">
            {formatValue(value1)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </MonthPicker>

        <MonthPicker value={value2} onValueChange={setValue2}>
          <Button variant="secondary">
            {formatValue(value2)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </MonthPicker>

        <MonthPicker value={value3} onValueChange={setValue3}>
          <Button variant="tertiary">
            {formatValue(value3)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </MonthPicker>
      </div>
    );
  },
};

// Select와 함께 사용
export const WithSelect: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <MonthPicker value={value} onValueChange={setValue}>
          <Select style={{ minWidth: '200px' }}>
            <option value="">{formatValue(value)}</option>
          </Select>
        </MonthPicker>

        {value && (
          <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
        )}
      </div>
    );
  },
};

// 비활성화 상태
export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(new Date(2024, 5, 1));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <MonthPicker value={value} onValueChange={setValue} disabled>
          <Button variant="secondary" disabled>
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </MonthPicker>

        <div style={{ fontSize: '14px', color: '#666' }}>비활성화된 상태입니다.</div>
      </div>
    );
  },
};

// 년도 범위 제한
export const YearRange: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <MonthPicker value={value} onValueChange={setValue} minYear={2020} maxYear={2030}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </MonthPicker>

        <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          년도 범위: 2020년 ~ 2030년
        </div>

        {value && (
          <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
        )}
      </div>
    );
  },
};

// 폼에서 사용하는 예시
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      startMonth: undefined as Date | undefined,
      endMonth: undefined as Date | undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`시작: ${formatValue(formData.startMonth)}, 종료: ${formatValue(formData.endMonth)}`);
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}
      >
        <h3 style={{ margin: 0, fontSize: '18px' }}>기간 선택</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>시작 월</label>
          <MonthPicker
            value={formData.startMonth}
            onValueChange={value => setFormData(prev => ({ ...prev, startMonth: value }))}
          >
            <Button variant="secondary" style={{ justifyContent: 'space-between' }}>
              {formatValue(formData.startMonth)}
              <KeyboardArrowDownIcon size={16} />
            </Button>
          </MonthPicker>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>종료 월</label>
          <MonthPicker
            value={formData.endMonth}
            onValueChange={value => setFormData(prev => ({ ...prev, endMonth: value }))}
          >
            <Button variant="secondary" style={{ justifyContent: 'space-between' }}>
              {formatValue(formData.endMonth)}
              <KeyboardArrowDownIcon size={16} />
            </Button>
          </MonthPicker>
        </div>

        <Button type="submit" style={{ marginTop: '8px' }}>
          제출
        </Button>
      </form>
    );
  },
};