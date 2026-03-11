import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './radio-group';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option-1');
    return (
      <RadioGroup onValueChange={(value) => setValue(value as string)} value={value}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RadioGroup.Item id="r1" value="option-1">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <label htmlFor="r1">옵션 1</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RadioGroup.Item id="r2" value="option-2">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <label htmlFor="r2">옵션 2</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RadioGroup.Item id="r3" value="option-3">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <label htmlFor="r3">옵션 3</label>
          </div>
        </div>
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup disabled value="option-1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RadioGroup.Item id="d1" value="option-1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="d1">옵션 1</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RadioGroup.Item id="d2" value="option-2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="d2">옵션 2</label>
        </div>
      </div>
    </RadioGroup>
  ),
};
