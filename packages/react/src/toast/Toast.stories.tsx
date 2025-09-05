import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Toaster, toast } from './index';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast 컴포넌트는 일시적인 알림 메시지를 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      description: '토스트 위치',
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      table: {
        type: { summary: 'ToastPosition' },
      },
    },
    richColors: {
      description: '풍부한 색상 사용 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div>
      <Toaster />
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button onClick={() => toast('기본 토스트')}>기본</Button>
        <Button onClick={() => toast.success('성공!')}>성공</Button>
        <Button onClick={() => toast.error('오류!')}>오류</Button>
        <Button onClick={() => toast.warning('주의!')}>경고</Button>
        <Button onClick={() => toast.info('정보!')}>정보</Button>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  render: args => (
    <div>
      <Toaster {...args} />
      <Button onClick={() => toast('Playground 토스트입니다!')}>토스트 표시</Button>
    </div>
  ),
  args: {
    position: 'bottom-right',
    richColors: true,
  },
};
