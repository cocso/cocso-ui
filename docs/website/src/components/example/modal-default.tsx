'use client';

import { Button, Modal } from '@cocso-ui/react';

export default function ModalDefault() {
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="secondary">모달 열기</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Title>제목</Modal.Title>
        <Modal.Description>모달의 설명을 입력합니다.</Modal.Description>
        <Modal.Close />
      </Modal.Content>
    </Modal>
  );
}
