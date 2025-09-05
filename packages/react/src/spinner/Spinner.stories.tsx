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

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', minWidth: '60px' }}>Sizes:</h4>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', minWidth: '60px' }}>
          Colors:
        </h4>
        <Spinner color="primary" />
        <Spinner color="neutral" />
        <div style={{ backgroundColor: '#333', padding: '8px', borderRadius: '4px' }}>
          <Spinner color="white" />
        </div>
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
