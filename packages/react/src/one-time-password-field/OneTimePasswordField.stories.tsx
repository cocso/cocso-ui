import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { OneTimePasswordField } from './OneTimePasswordField';

const meta = {
  title: 'Components/OneTimePasswordField',
  component: OneTimePasswordField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'OneTimePasswordField 컴포넌트는 일회용 비밀번호(OTP) 입력을 위한 필드입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      description: 'OTP 최대 길이',
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    value: {
      description: 'OTP 값',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description: 'OTP 값 변경 시 호출되는 함수',
      action: 'onValueChange',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    disabled: {
      description: '비활성화 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof OneTimePasswordField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const [value4, setValue4] = useState('');
    const [value6, setValue6] = useState('');
    const [value8, setValue8] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>4 Digits</h4>
          <OneTimePasswordField maxLength={4} value={value4} onValueChange={setValue4}>
            {Array.from({ length: 4 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: OTP inputs are statically positioned
              <OneTimePasswordField.Input key={index} index={index} />
            ))}
          </OneTimePasswordField>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>6 Digits</h4>
          <OneTimePasswordField maxLength={6} value={value6} onValueChange={setValue6}>
            {Array.from({ length: 6 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: OTP inputs are statically positioned
              <OneTimePasswordField.Input key={index} index={index} />
            ))}
          </OneTimePasswordField>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>8 Digits</h4>
          <OneTimePasswordField maxLength={8} value={value8} onValueChange={setValue8}>
            {Array.from({ length: 8 }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: OTP inputs are statically positioned
              <OneTimePasswordField.Input key={index} index={index} />
            ))}
          </OneTimePasswordField>
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  render: args => {
    const [value, setValue] = useState('');
    const maxLength = args.maxLength || 6;

    return (
      <OneTimePasswordField {...args} value={value} onValueChange={setValue}>
        {Array.from({ length: maxLength }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: OTP inputs are statically positioned
          <OneTimePasswordField.Input key={index} index={index} />
        ))}
      </OneTimePasswordField>
    );
  },
  args: {
    maxLength: 6,
    disabled: false,
  },
};
