import { CalendarMonthIcon } from '@cocso-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '../dropdown';
import { InputTrigger } from './input-trigger';

const meta = {
  title: 'Components/InputTrigger',
  component: InputTrigger,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    error: { control: 'text', description: 'true(시각 효과만) 또는 에러 메시지 문자열' },
    stretch: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    size: 'medium',
    placeholder: '날짜를 선택하세요',
  },
} satisfies Meta<typeof InputTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { suffix: <CalendarMonthIcon /> },
};

export const WithValue: Story = {
  args: { children: '2026-06-17', suffix: <CalendarMonthIcon /> },
};

/**
 * Being a native button, `InputTrigger` can be passed to `Dropdown.Trigger`
 * (or `DayPicker` / `MonthPicker` `trigger`) without Base UI's `nativeButton`
 * warning, while still looking like an input.
 */
export const AsDropdownTrigger: Story = {
  render: (args) => (
    <Dropdown>
      <Dropdown.Trigger render={<InputTrigger {...args} suffix={<CalendarMonthIcon />} />} />
      <Dropdown.Content aria-label="옵션">
        <Dropdown.Item>옵션 1</Dropdown.Item>
        <Dropdown.Item>옵션 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};
