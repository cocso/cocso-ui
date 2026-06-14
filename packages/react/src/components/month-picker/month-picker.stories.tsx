import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { MonthPicker } from './month-picker';

const meta = {
  title: 'Components/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof MonthPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <MonthPicker
        onValueChange={d => setDate(d ?? undefined)}
        trigger={
          <Button variant="outline">
            {date ? date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : '월 선택'}
          </Button>
        }
        value={date}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date] = useState<Date | undefined>(new Date());
    return (
      <MonthPicker
        disabled
        onValueChange={() => {}}
        trigger={
          <Button disabled variant="outline">
            {date ? date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : '월 선택'}
          </Button>
        }
        value={date}
      />
    );
  },
};
