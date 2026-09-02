import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { DayPicker } from './day-picker';

const meta = {
  title: 'Components/DayPicker',
  component: DayPicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof DayPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <DayPicker
        onValueChange={d => setDate(d ?? undefined)}
        trigger={<Button variant="outline">{date ? date.toLocaleDateString('ko-KR') : '날짜 선택'}</Button>}
        value={date}
      />
    );
  },
};

export const WithMinMax: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return (
      <DayPicker
        maxDate={maxDate}
        minDate={minDate}
        onValueChange={d => setDate(d ?? undefined)}
        trigger={<Button variant="outline">{date ? date.toLocaleDateString('ko-KR') : '이번 달만 선택 가능'}</Button>}
        value={date}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    // Fixed, not `new Date()`: the trigger renders this date as text, and the
    // story has a committed visual-regression baseline, so a live date fails
    // the comparison every midnight.
    const [date] = useState<Date | undefined>(new Date(2026, 0, 15));
    return (
      <DayPicker
        disabled
        onValueChange={() => {}}
        trigger={<Button disabled variant="outline">{date ? date.toLocaleDateString('ko-KR') : '날짜 선택'}</Button>}
        value={date}
      />
    );
  },
};
