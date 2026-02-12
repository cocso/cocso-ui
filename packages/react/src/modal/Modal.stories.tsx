import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal 컴포넌트는 중요한 정보나 액션을 위한 오버레이 대화상자입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      description: '모달 열림 상태',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onOpenChange: {
      description: '모달 열림 상태 변경 시 호출되는 함수',
      action: 'onOpenChange',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    modal: {
      description: '모달 모드 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Modal 사용법입니다. 제목, 설명, 확인/취소 버튼이 포함됩니다.' } },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Button>기본 모달</Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Title>기본 모달</Modal.Title>
          <Modal.Description>기본 모달의 설명입니다.</Modal.Description>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}
          >
            <Modal.Close asChild>
              <Button variant="secondary">취소</Button>
            </Modal.Close>
            <Button>확인</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  },
};

export const Confirm: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '확인/취소 동작이 포함된 확인 모달입니다.' } },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Button>확인 모달</Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Title>변경 사항 저장</Modal.Title>
          <Modal.Description>변경 사항을 저장하시겠습니까? 이 작업은 되돌릴 수 없습니다.</Modal.Description>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}
          >
            <Modal.Close asChild>
              <Button variant="secondary">취소</Button>
            </Modal.Close>
            <Button>저장</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  },
};

export const Danger: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '삭제 등 위험한 동작을 확인하는 모달입니다.' } },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Button variant="danger">삭제 모달</Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Title>항목 삭제</Modal.Title>
          <Modal.Description>정말로 삭제하시겠습니까?</Modal.Description>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}
          >
            <Modal.Close asChild>
              <Button variant="secondary">취소</Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="danger">삭제</Button>
            </Modal.Close>
          </div>
        </Modal.Content>
      </Modal>
    );
  },
};

export const Playground: Story = {
  render: args => {
    const [open, setOpen] = useState(false);

    return (
      <Modal {...args} open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Button>모달 열기</Button>
        </Modal.Trigger>
        <Modal.Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <Modal.Title>Playground 모달</Modal.Title>
            <Modal.Close />
          </div>
          <Modal.Description>Controls 패널에서 조작할 수 있는 모달입니다.</Modal.Description>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}
          >
            <Modal.Close asChild>
              <Button variant="secondary">취소</Button>
            </Modal.Close>
            <Button>확인</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  },
  args: {
    modal: true,
  },
};
