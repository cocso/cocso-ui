import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { OneTimePasswordField } from './one-time-password-field';

const meta = {
  title: 'Components/OneTimePasswordField',
  component: OneTimePasswordField,
} satisfies Meta<typeof OneTimePasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <OneTimePasswordField maxLength={6} onValueChange={setValue} value={value}>
        {Array.from({ length: 6 }, (_, i) => (
          <OneTimePasswordField.Input index={i} key={i} />
        ))}
      </OneTimePasswordField>
    );
  },
};

export const FourDigits: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <OneTimePasswordField maxLength={4} onValueChange={setValue} value={value}>
        {Array.from({ length: 4 }, (_, i) => (
          <OneTimePasswordField.Input index={i} key={i} />
        ))}
      </OneTimePasswordField>
    );
  },
};
