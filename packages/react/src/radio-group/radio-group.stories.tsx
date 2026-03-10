import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './radio-group';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RadioGroup 컴포넌트는 여러 옵션 중 하나를 선택할 수 있는 라디오 버튼 그룹입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: '현재 선택된 값',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description: '값 변경 시 호출되는 함수',
      action: 'changed',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    disabled: {
      description: '라디오 그룹 비활성화 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    defaultValue: {
      description: '초기 선택값',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const [value1, setValue1] = useState('option1');
    const [value2, setValue2] = useState('option2');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Basic</h4>
          <RadioGroup onValueChange={setValue1} value={value1}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="radio1" value="option1">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="radio1">옵션 1</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="radio2" value="option2">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="radio2">옵션 2</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="radio3" value="option3">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="radio3">옵션 3</label>
            </div>
          </RadioGroup>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Disabled</h4>
          <RadioGroup disabled onValueChange={setValue2} value={value2}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="disabled-radio1" value="option1">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="disabled-radio1">비활성화된 옵션 1</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="disabled-radio2" value="option2">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="disabled-radio2">비활성화된 옵션 2</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="disabled-radio3" value="option3">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="disabled-radio3">비활성화된 옵션 3</label>
            </div>
          </RadioGroup>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
            Disabled Item
          </h4>
          <RadioGroup defaultValue="option2">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="partial-disabled-radio1" value="option1">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="partial-disabled-radio1">옵션 1</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item disabled id="partial-disabled-radio2" value="option2">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="partial-disabled-radio2">비활성화된 옵션 2</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item id="partial-disabled-radio3" value="option3">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="partial-disabled-radio3">옵션 3</label>
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  render: args => {
    const [value, setValue] = useState(args.value || args.defaultValue || 'option1');

    return (
      <RadioGroup {...args} onValueChange={setValue} value={value}>
        <RadioGroup.Item id="playground-radio1" value="option1">
          <RadioGroup.Indicator />
          <label htmlFor="playground-radio1">옵션 1</label>
        </RadioGroup.Item>
        <RadioGroup.Item id="playground-radio2" value="option2">
          <RadioGroup.Indicator />
          <label htmlFor="playground-radio2">옵션 2</label>
        </RadioGroup.Item>
        <RadioGroup.Item id="playground-radio3" value="option3">
          <RadioGroup.Indicator />
          <label htmlFor="playground-radio3">옵션 3</label>
        </RadioGroup.Item>
      </RadioGroup>
    );
  },
  args: {
    defaultValue: 'option1',
    disabled: false,
  },
};
