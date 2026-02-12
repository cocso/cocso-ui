import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'RadioGroup 컴포넌트는 여러 옵션 중 하나를 선택할 수 있는 라디오 버튼 그룹입니다.',
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

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 RadioGroup 사용법입니다.' } },
  },
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup.Item value="option1" id="default-radio1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="default-radio1">옵션 1</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup.Item value="option2" id="default-radio2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="default-radio2">옵션 2</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup.Item value="option3" id="default-radio3">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="default-radio3">옵션 3</label>
        </div>
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '전체 그룹 비활성화와 개별 항목 비활성화를 비교합니다.' } },
  },
  render: () => {
    const [value, setValue] = useState('option2');

    return (
      <div style={columnStyle}>
        <div>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#666' }}>전체 비활성화</div>
          <RadioGroup value={value} onValueChange={setValue} disabled>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item value="option1" id="disabled-radio1">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="disabled-radio1">비활성화된 옵션 1</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item value="option2" id="disabled-radio2">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="disabled-radio2">비활성화된 옵션 2</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item value="option3" id="disabled-radio3">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="disabled-radio3">비활성화된 옵션 3</label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#666' }}>개별 항목 비활성화</div>
          <RadioGroup defaultValue="option2">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item value="option1" id="partial-disabled-radio1">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="partial-disabled-radio1">옵션 1</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item value="option2" id="partial-disabled-radio2" disabled>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor="partial-disabled-radio2">비활성화된 옵션 2</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item value="option3" id="partial-disabled-radio3">
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
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <RadioGroup.Item value="option1" id="playground-radio1">
          <RadioGroup.Indicator />
          <label htmlFor="playground-radio1">옵션 1</label>
        </RadioGroup.Item>
        <RadioGroup.Item value="option2" id="playground-radio2">
          <RadioGroup.Indicator />
          <label htmlFor="playground-radio2">옵션 2</label>
        </RadioGroup.Item>
        <RadioGroup.Item value="option3" id="playground-radio3">
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
