import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './radio-group';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option-1');
    return (
      <RadioGroup onValueChange={v => setValue(v as string)} value={value}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['옵션 1', '옵션 2', '옵션 3'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RadioGroup.Item id={`r${i + 1}`} value={`option-${i + 1}`}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor={`r${i + 1}`}>{label}</label>
            </div>
          ))}
        </div>
      </RadioGroup>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('option-1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(['small', 'medium', 'large'] as const).map((size) => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RadioGroup onValueChange={v => setValue(v as string)} value={value}>
              <RadioGroup.Item id={`size-${size}`} size={size} value="option-1">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            </RadioGroup>
            <label htmlFor={`size-${size}`} style={{ fontSize: 14 }}>{size}</label>
          </div>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup disabled value="option-1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['옵션 1', '옵션 2'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RadioGroup.Item id={`d${i + 1}`} value={`option-${i + 1}`}>
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <label htmlFor={`d${i + 1}`}>{label}</label>
          </div>
        ))}
      </div>
    </RadioGroup>
  ),
};
