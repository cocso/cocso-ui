import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { DateTimePicker } from './date-time-picker';

const meta = {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    timeIntervals: { control: 'number' },
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const label = (date?: Date) =>
  date
    ? date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '날짜와 시각 선택';

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <DateTimePicker
        onValueChange={d => setDate(d ?? undefined)}
        trigger={<Button variant="outline">{label(date)}</Button>}
        value={date}
      />
    );
  },
};

/** A booking window: nothing before tomorrow, nothing after two weeks out. */
export const MinAndMax: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const min = new Date();
    min.setDate(min.getDate() + 1);
    const max = new Date();
    max.setDate(max.getDate() + 14);
    return (
      <DateTimePicker
        maxDate={max}
        minDate={min}
        onValueChange={d => setDate(d ?? undefined)}
        trigger={<Button variant="outline">{label(date)}</Button>}
        value={date}
      />
    );
  },
};

/** The default half hour, and the ten minutes a tighter slot needs. */
export const Intervals: Story = {
  render: () => {
    const [half, setHalf] = useState<Date | undefined>(undefined);
    const [ten, setTen] = useState<Date | undefined>(undefined);
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        <DateTimePicker
          onValueChange={d => setHalf(d ?? undefined)}
          timeIntervals={30}
          trigger={<Button variant="outline">30분 · {label(half)}</Button>}
          value={half}
        />
        <DateTimePicker
          onValueChange={d => setTen(d ?? undefined)}
          timeIntervals={10}
          trigger={<Button variant="outline">10분 · {label(ten)}</Button>}
          value={ten}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => <DateTimePicker disabled />,
};

export const CustomTrigger: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <DateTimePicker
        onValueChange={d => setDate(d ?? undefined)}
        trigger={<Button variant="surface">{label(date)}</Button>}
        value={date}
      />
    );
  },
};
