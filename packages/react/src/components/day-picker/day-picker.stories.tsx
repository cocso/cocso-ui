import type { Meta, StoryObj } from '@storybook/react';
import userEvent from '@testing-library/user-event';
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
    <DayPicker
      trigger={<Button variant="outline">2024년 1월 15일</Button>}
      value={new Date(2024, 0, 15)}
    />
  ),
};
