import type { Meta, StoryObj } from '@storybook/react';
import { Button, toast, Toaster } from '@cocso-ui/react';

const meta = {
  title: 'react/toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster richColors />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => toast('기본 토스트 메시지입니다.')}>기본 토스트</Button>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => toast.success('성공적으로 처리되었습니다!')}>성공 토스트</Button>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => toast.error('오류가 발생했습니다.')}>에러 토스트</Button>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => toast.warning('주의가 필요한 작업입니다.')}>경고 토스트</Button>
    </div>
  ),
};

export const Info: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => toast.info('정보를 확인해주세요.')}>정보 토스트</Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button
        onClick={() =>
          toast('파일 업로드 완료', {
            description: 'example.pdf 파일이 성공적으로 업로드되었습니다.',
          })
        }
      >
        설명이 있는 토스트
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button
        onClick={() =>
          toast('새로운 업데이트가 있습니다', {
            action: {
              label: '업데이트',
              onClick: () => console.log('업데이트 클릭됨'),
            },
          })
        }
      >
        액션이 있는 토스트
      </Button>
    </div>
  ),
};

export const WithDismiss: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button
        onClick={() =>
          toast('이 토스트는 수동으로 닫을 수 있습니다', {
            duration: Number.POSITIVE_INFINITY,
          })
        }
      >
        수동 닫기 토스트
      </Button>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Toast Types</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => toast('기본 토스트 메시지')}>기본</Button>
        <Button onClick={() => toast.success('성공 메시지')}>성공</Button>
        <Button onClick={() => toast.error('에러 메시지')}>에러</Button>
        <Button onClick={() => toast.warning('경고 메시지')}>경고</Button>
        <Button onClick={() => toast.info('정보 메시지')}>정보</Button>
      </div>
    </div>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Custom Duration</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => toast('1초 후 사라집니다', { duration: 1000 })}>1초</Button>
        <Button onClick={() => toast('3초 후 사라집니다', { duration: 3000 })}>3초</Button>
        <Button onClick={() => toast('5초 후 사라집니다', { duration: 5000 })}>5초</Button>
        <Button onClick={() => toast('수동으로 닫아주세요', { duration: Number.POSITIVE_INFINITY })}>무제한</Button>
      </div>
    </div>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button
        onClick={() => {
          const promise = new Promise((resolve) => {
            setTimeout(() => resolve('완료!'), 3000);
          });

          toast.promise(promise, {
            loading: '처리 중...',
            success: '성공적으로 완료되었습니다!',
            error: '오류가 발생했습니다.',
          });
        }}
      >
        Promise 토스트 (3초)
      </Button>
    </div>
  ),
};

export const MultipleToasts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button
        onClick={() => {
          toast('첫 번째 토스트');
          setTimeout(() => toast.success('두 번째 토스트'), 500);
          setTimeout(() => toast.error('세 번째 토스트'), 1000);
          setTimeout(() => toast.warning('네 번째 토스트'), 1500);
        }}
      >
        여러 토스트 연속 표시
      </Button>
    </div>
  ),
};
