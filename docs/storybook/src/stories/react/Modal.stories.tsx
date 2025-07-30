import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@cocso-ui/react';
import { useState } from 'react';

const meta = {
  title: 'react/modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

// Modal with Trigger Button
const ModalWithTrigger = ({ children, ...props }: any) => {
  return (
    <Modal {...props}>
      <Modal.Trigger asChild>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          모달 열기
        </button>
      </Modal.Trigger>
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
};

// Controlled Modal
const ControlledModal = ({ children, ...props }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        모달 열기
      </button>
      <Modal open={open} onOpenChange={setOpen} {...props}>
        <Modal.Content>{children}</Modal.Content>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <ModalWithTrigger>
      <Modal.Title>기본 모달</Modal.Title>
      <Modal.Description>
        이것은 기본 모달입니다. 모달의 기본적인 사용법을 보여줍니다.
      </Modal.Description>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </ModalWithTrigger>
  ),
};

export const Controlled: Story = {
  render: () => (
    <ControlledModal>
      <Modal.Title>제어된 모달</Modal.Title>
      <Modal.Description>
        이 모달은 React state로 제어됩니다. 외부에서 열고 닫을 수 있습니다.
      </Modal.Description>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </ControlledModal>
  ),
};

export const LargeContent: Story = {
  render: () => (
    <ModalWithTrigger>
      <Modal.Title>긴 내용의 모달</Modal.Title>
      <Modal.Description>
        이 모달은 긴 내용을 포함하고 있습니다. 스크롤이 가능하며 최대 높이가 제한되어 있습니다.
      </Modal.Description>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            padding: '16px',
            margin: '8px 0',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>섹션 {i + 1}</h3>
          <p style={{ margin: 0, lineHeight: '1.5' }}>
            이것은 섹션 {i + 1}의 내용입니다. 긴 텍스트를 포함하여 스크롤을 테스트할 수 있습니다.
          </p>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </ModalWithTrigger>
  ),
};

export const FormModal: Story = {
  render: () => (
    <ModalWithTrigger>
      <Modal.Title>폼 모달</Modal.Title>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>이름</label>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>이메일</label>
          <input
            type="email"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>메시지</label>
          <textarea
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '100px',
              resize: 'vertical',
            }}
            placeholder="메시지를 입력하세요"
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            제출
          </button>
        </div>
      </form>
    </ModalWithTrigger>
  ),
};

export const AlertModal: Story = {
  render: () => (
    <ModalWithTrigger>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#dc3545',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
        }}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>!</span>
      </div>
      <Modal.Title>경고</Modal.Title>
      <Modal.Description>이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?</Modal.Description>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          삭제
        </button>
      </div>
    </ModalWithTrigger>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <ModalWithTrigger>
      <Modal.Title>제목만 있는 모달</Modal.Title>
      <div style={{ marginTop: '24px' }}>
        <p style={{ margin: '0 0 16px 0', lineHeight: '1.5' }}>
          이 모달은 제목만 있고 설명은 없습니다. 간단한 알림이나 확인 메시지에 적합합니다.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </ModalWithTrigger>
  ),
};

export const SuccessModal: Story = {
  render: () => (
    <ModalWithTrigger>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#28a745',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
        }}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>✓</span>
      </div>
      <Modal.Title>성공</Modal.Title>
      <Modal.Description>
        작업이 성공적으로 완료되었습니다. 변경사항이 저장되었습니다.
      </Modal.Description>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          확인
        </button>
      </div>
    </ModalWithTrigger>
  ),
};
