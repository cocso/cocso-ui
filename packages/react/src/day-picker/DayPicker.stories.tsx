import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Select } from '../select';
import { DayPicker } from './DayPicker';

const meta: Meta<typeof DayPicker> = {
  title: 'Components/DayPicker',
  component: DayPicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '날짜를 선택할 수 있는 컴포넌트입니다. Dropdown 컴포넌트를 기반으로 구현되어 일관된 사용자 경험을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
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

const formatValue = (value: Date | undefined) => {
  if (!value) {
    return '날짜를 선택하세요';
  }
  return value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

// 기본 사용법
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <DayPicker value={value} onValueChange={setValue}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

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
        <DayPicker value={value1} onValueChange={setValue1}>
          <Button variant="primary">
            {formatValue(value1)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <DayPicker value={value2} onValueChange={setValue2}>
          <Button variant="secondary">
            {formatValue(value2)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <DayPicker value={value3} onValueChange={setValue3}>
          <Button variant="tertiary">
            {formatValue(value3)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>
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
        <DayPicker value={value} onValueChange={setValue}>
          <Select style={{ minWidth: '200px' }}>
            <option value="">{formatValue(value)}</option>
          </Select>
        </DayPicker>

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
    const [value, setValue] = useState<Date | undefined>(new Date(2024, 5, 15));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <DayPicker value={value} onValueChange={setValue} disabled>
          <Button variant="secondary" disabled>
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <div style={{ fontSize: '14px', color: '#666' }}>비활성화된 상태입니다.</div>
      </div>
    );
  },
};


// 폼에서 사용하는 예시
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`시작: ${formatValue(formData.startDate)}, 종료: ${formatValue(formData.endDate)}`);
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}
      >
        <h3 style={{ margin: 0, fontSize: '18px' }}>기간 선택</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>시작 날짜</label>
          <DayPicker
            value={formData.startDate}
            onValueChange={value => setFormData(prev => ({ ...prev, startDate: value }))}
          >
            <Button variant="secondary" style={{ justifyContent: 'space-between' }}>
              {formatValue(formData.startDate)}
              <KeyboardArrowDownIcon size={16} />
            </Button>
          </DayPicker>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>종료 날짜</label>
          <DayPicker
            value={formData.endDate}
            onValueChange={value => setFormData(prev => ({ ...prev, endDate: value }))}
          >
            <Button variant="secondary" style={{ justifyContent: 'space-between' }}>
              {formatValue(formData.endDate)}
              <KeyboardArrowDownIcon size={16} />
            </Button>
          </DayPicker>
        </div>

        <Button type="submit" style={{ marginTop: '8px' }}>
          제출
        </Button>
      </form>
    );
  },
};

// 미리 선택된 값
export const WithPreselectedValue: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(new Date(2024, 11, 25));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <DayPicker value={value} onValueChange={setValue}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
      </div>
    );
  },
};

// 오늘 날짜 하이라이트
export const WithTodayHighlight: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <DayPicker value={value} onValueChange={setValue}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          오늘 날짜가 자동으로 하이라이트됩니다.
        </div>

        {value && (
          <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
        )}
      </div>
    );
  },
};

// 한국어 로케일 및 커스텀 헤더
export const KoreanLocale: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <DayPicker value={value} onValueChange={setValue}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          커스텀 헤더로 "2025년 9월" 형식으로 표시됩니다.
        </div>

        {value && (
          <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
        )}
      </div>
    );
  },
};

// MonthPicker 스타일 테마
export const MonthPickerStyle: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <DayPicker value={value} onValueChange={setValue}>
          <Button variant="secondary">
            {formatValue(value)}
            <KeyboardArrowDownIcon size={16} />
          </Button>
        </DayPicker>

        <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          MonthPicker와 동일한 스타일의 커스텀 헤더와 테마가 적용되었습니다.
        </div>

        {value && (
          <div style={{ fontSize: '14px', color: '#666' }}>선택된 값: {formatValue(value)}</div>
        )}
      </div>
    );
  },
};

// 다양한 날짜 포맷
export const DateFormats: Story = {
  render: () => {
    const [value1, setValue1] = useState<Date | undefined>();
    const [value2, setValue2] = useState<Date | undefined>();
    const [value3, setValue3] = useState<Date | undefined>();

    const formatShort = (value: Date | undefined) => {
      if (!value) return '날짜 선택';
      return value.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    const formatLong = (value: Date | undefined) => {
      if (!value) return '날짜를 선택하세요';
      return value.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <DayPicker value={value1} onValueChange={setValue1}>
            <Button variant="secondary" size="sm">
              {formatShort(value1)}
              <KeyboardArrowDownIcon size={14} />
            </Button>
          </DayPicker>

          <DayPicker value={value2} onValueChange={setValue2}>
            <Button variant="secondary">
              {formatValue(value2)}
              <KeyboardArrowDownIcon size={16} />
            </Button>
          </DayPicker>

          <DayPicker value={value3} onValueChange={setValue3}>
            <Button variant="secondary" size="lg">
              {formatLong(value3)}
              <KeyboardArrowDownIcon size={18} />
            </Button>
          </DayPicker>
        </div>

        <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          다양한 날짜 포맷과 버튼 크기로 사용할 수 있습니다.
        </div>
      </div>
    );
  },
};
