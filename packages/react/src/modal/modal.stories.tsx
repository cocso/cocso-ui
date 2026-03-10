import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Modal } from './modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger asChild>
        <Button>모달 열기</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Close />
        <Modal.Title>모달 제목</Modal.Title>
        <Modal.Description>모달 설명 텍스트입니다.</Modal.Description>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Modal.Close asChild>
            <Button variant="secondary">취소</Button>
          </Modal.Close>
          <Button>확인</Button>
        </div>
      </Modal.Content>
    </Modal>
  ),
};

export const Confirm: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="error">삭제</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Title>항목 삭제</Modal.Title>
        <Modal.Description>정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</Modal.Description>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Modal.Close asChild>
            <Button variant="secondary">취소</Button>
          </Modal.Close>
          <Modal.Close asChild>
            <Button variant="error">삭제</Button>
          </Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  ),
};
