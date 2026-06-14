import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Toaster, toast } from './index';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
    richColors: { control: 'boolean' },
  },
  args: {
    position: 'bottom-right',
    richColors: false,
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <div>
      <Toaster {...args} />
      <Button onClick={() => toast('토스트 메시지입니다!')}>토스트 표시</Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div>
      <Toaster />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => toast('기본 토스트')}>기본</Button>
        <Button variant="success" onClick={() => toast.success('성공!')}>성공</Button>
        <Button variant="error" onClick={() => toast.error('오류!')}>오류</Button>
        <Button variant="warning" onClick={() => toast.warning('주의!')}>경고</Button>
        <Button variant="outline" onClick={() => toast.info('정보!')}>정보</Button>
      </div>
    </div>
  ),
};
