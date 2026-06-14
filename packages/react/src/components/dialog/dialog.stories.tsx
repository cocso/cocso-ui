import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Dialog } from './dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>다이얼로그 열기</Button>} />
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Title>다이얼로그 제목</Dialog.Title>
        <Dialog.Description>다이얼로그 설명 텍스트입니다.</Dialog.Description>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Dialog.Close render={<Button size="small" variant="outline">취소</Button>} />
          <Button size="small">확인</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Small: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button variant="outline">Small</Button>} />
      <Dialog.Content size="small">
        <Dialog.Close />
        <Dialog.Title>항목 삭제</Dialog.Title>
        <Dialog.Description>정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</Dialog.Description>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Dialog.Close render={<Button size="small" variant="outline">취소</Button>} />
          <Dialog.Close render={<Button size="small" variant="error">삭제</Button>} />
        </div>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Medium: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button variant="outline">Medium</Button>} />
      <Dialog.Content size="medium">
        <Dialog.Close />
        <Dialog.Title>설정 변경</Dialog.Title>
        <Dialog.Description>
          변경 사항을 적용하시겠습니까? 설정이 즉시 반영됩니다.
        </Dialog.Description>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Dialog.Close render={<Button size="small" variant="outline">취소</Button>} />
          <Button size="small">적용</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Large: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button variant="outline">Large</Button>} />
      <Dialog.Content size="large">
        <Dialog.Close />
        <Dialog.Title>이용 약관</Dialog.Title>
        <Dialog.Description>
          서비스 이용 약관을 확인해 주세요. 아래 내용을 읽고 동의해 주시기 바랍니다.
        </Dialog.Description>
        <div style={{ maxHeight: '300px', overflow: 'auto', marginTop: '16px', padding: '12px', backgroundColor: 'var(--cocso-color-neutral-50)', borderRadius: 'var(--cocso-radius-3)', fontSize: '14px', lineHeight: '1.6' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Dialog.Close render={<Button size="small" variant="outline">닫기</Button>} />
          <Button size="small">동의</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  ),
};

export const WithoutClose: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button variant="outline">열기</Button>} />
      <Dialog.Content>
        <Dialog.Title>닫기 버튼 없음</Dialog.Title>
        <Dialog.Description>닫기 버튼이 없는 다이얼로그입니다. 버튼으로만 닫을 수 있습니다.</Dialog.Description>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Dialog.Close render={<Button size="small">닫기</Button>} />
        </div>
      </Dialog.Content>
    </Dialog>
  ),
};
