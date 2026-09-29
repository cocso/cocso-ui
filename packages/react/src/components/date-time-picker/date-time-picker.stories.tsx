import type { Meta, StoryObj } from '@storybook/react';
import userEvent from '@testing-library/user-event';
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

/**
 * Open the popover the way a reader does. `userEvent` sends the full pointer
 * sequence; `HTMLElement.click()` dispatches a bare click event, which the
 * Base UI trigger under the hood does not open on.
 */
const openCalendar = async (canvasElement: HTMLElement) => {
  const trigger = canvasElement.querySelector('button');
  if (!trigger) {
    throw new Error('the story rendered no trigger to open');
  }
  await userEvent.click(trigger);
  // The popover mounts in a portal, so it is outside `canvasElement`.
  for (let i = 0; i < 100 && !document.querySelector('.react-datepicker'); i += 1) {
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  if (!document.querySelector('.react-datepicker')) {
    throw new Error('the calendar never opened, so the screenshot would show only the trigger');
  }
};

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

/**
 * The calendar open, so the popover — the part with the layout — is under the
 * pixel check. Every picker story before this one screenshotted the closed
 * trigger, which is how the DateTimePicker shipped with its time column
 * stacked under the calendar instead of beside it: nothing in CI could see it.
 *
 * A `play` function rather than the `defaultOpen` the other overlays use, since
 * a picker owns its open state and exposes no prop for it. `parameters.overlay`
 * turns motion off and widens the axe scope past `#storybook-root`, which
 * cannot see the portal the popover mounts into — see
 * `.storybook/test-runner.ts`.
 *
 * The value is pinned. An unpinned picker renders the current month, so the
 * baseline would rot the moment the month turned.
 */
export const Open: Story = {
  parameters: { overlay: true },
  play: async ({ canvasElement }) => {
    await openCalendar(canvasElement);
  },
  render: () => (
    <DateTimePicker
      trigger={<Button variant="outline">2024년 1월 15일 14:30</Button>}
      value={new Date(2024, 0, 15, 14, 30)}
    />
  ),
};
