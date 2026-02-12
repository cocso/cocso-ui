import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spinner 컴포넌트는 로딩 상태를 나타내는 회전하는 인디케이터입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: '스피너의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'SpinnerSize' },
      },
    },
    color: {
      description: '스피너의 색상',
      control: 'select',
      options: ['primary', 'neutral', 'white'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'SpinnerColor' },
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Spinner 사용법입니다.' } },
  },
  args: {},
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 사이즈를 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 색상을 비교합니다. white는 어두운 배경에서 사용합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Spinner color="primary" />
      <Spinner color="neutral" />
      <div style={{ backgroundColor: '#333', padding: 8, borderRadius: 4 }}>
        <Spinner color="white" />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};
