import type { Meta, StoryObj } from '@storybook/react';
import { CalendarMonthIcon } from '@cocso-ui/react-icons';
import { FormField } from './form-field';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <FormField>
        <FormField.Label>상호</FormField.Label>
        <FormField.Input placeholder="코크소" />
      </FormField>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <FormField>
        <FormField.Label required>이메일</FormField.Label>
        <FormField.Input placeholder="example@cocso.ai" required type="email" />
      </FormField>
    </div>
  ),
};

/** Every row of a form starts its control at the same place. */
export const Form: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '480px' }}>
      <FormField>
        <FormField.Label required>상호</FormField.Label>
        <FormField.Input defaultValue="코크소" required />
      </FormField>
      <FormField>
        <FormField.Label>사업자등록번호</FormField.Label>
        <FormField.Value>123-45-67890</FormField.Value>
      </FormField>
      <FormField>
        <FormField.Label required>비밀번호</FormField.Label>
        <FormField.Input autoComplete="new-password" defaultValue="secret" required type="password" />
      </FormField>
      <FormField>
        <FormField.Label>계약 시작월</FormField.Label>
        <FormField.InputTrigger
          placeholder="월 선택"
          suffix={<CalendarMonthIcon size={14} />}
          value="2026-01"
        />
      </FormField>
    </div>
  ),
};

/** `width` sets the label column; a number is pixels. */
export const LabelWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '480px' }}>
      <FormField>
        <FormField.Label width={80}>이름</FormField.Label>
        <FormField.Input defaultValue="홍길동" />
      </FormField>
      <FormField>
        <FormField.Label width={80}>연락처</FormField.Label>
        <FormField.Input defaultValue="010-0000-0000" />
      </FormField>
    </div>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <FormField>
        <FormField.Label>계약 시작월</FormField.Label>
        <FormField.InputTrigger placeholder="월 선택" suffix={<CalendarMonthIcon size={14} />} />
      </FormField>
    </div>
  ),
};
