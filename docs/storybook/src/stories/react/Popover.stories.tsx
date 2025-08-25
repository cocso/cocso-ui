import { Popover } from '@cocso-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta = {
  title: 'React/popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
    },
    open: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

// Basic popover with Trigger button
const BasicPopover = ({ children, ...props }: any) => {
  return (
    <Popover {...props}>
      <Popover.Trigger asChild>
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
          팝오버 열기
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>{children}</Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

// Controlled popover
const ControlledPopover = ({ children, ...props }: any) => {
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
        제어된 팝오버 열기
      </button>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <Popover.Portal>
          <Popover.Content>{children}</Popover.Content>
        </Popover.Portal>
      </Popover>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <BasicPopover>
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>기본 팝오버</h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
          이것은 기본 팝오버입니다. 클릭하면 나타나고 외부를 클릭하면 사라집니다.
        </p>
      </div>
    </BasicPopover>
  ),
};

export const Controlled: Story = {
  render: () => (
    <ControlledPopover>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>제어된 팝오버</h3>
      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
        이 팝오버는 React state로 제어됩니다. 외부에서 열고 닫을 수 있습니다.
      </p>
    </ControlledPopover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <BasicPopover>
      <div style={{ minWidth: '300px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>설정</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}
            >
              알림 설정
            </label>
            <select
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option>모든 알림</option>
              <option>중요한 알림만</option>
              <option>알림 끄기</option>
            </select>
          </div>
          <div>
            <label
              style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}
            >
              테마
            </label>
            <select
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option>라이트</option>
              <option>다크</option>
              <option>시스템</option>
            </select>
          </div>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}
          >
            <button
              type="button"
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </BasicPopover>
  ),
};

export const WithActions: Story = {
  render: () => (
    <BasicPopover>
      <div style={{ padding: '16px', minWidth: '200px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>작업 메뉴</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              borderRadius: '4px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            편집
          </button>
          <button
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              borderRadius: '4px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            복사
          </button>
          <button
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              borderRadius: '4px',
              color: '#dc3545',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </BasicPopover>
  ),
};

export const WithImage: Story = {
  render: () => (
    <BasicPopover>
      <div style={{ padding: '16px', minWidth: '250px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
            }}
          >
            U
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>사용자 정보</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
              user@example.com
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '12px' }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
            이 사용자는 관리자 권한을 가지고 있으며, 시스템의 모든 기능에 접근할 수 있습니다.
          </p>
        </div>
      </div>
    </BasicPopover>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <BasicPopover>
      <div style={{ padding: '16px', minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#28a745',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>온라인</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', color: '#6c757d' }}>
          마지막 활동: 2분 전
        </p>
      </div>
    </BasicPopover>
  ),
};

export const MultiplePopovers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Popover>
        <Popover.Trigger asChild>
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
            정보
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>정보</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                이것은 정보 팝오버입니다.
              </p>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover>

      <Popover>
        <Popover.Trigger asChild>
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
            성공
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>성공</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                작업이 성공적으로 완료되었습니다.
              </p>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover>

      <Popover>
        <Popover.Trigger asChild>
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
            경고
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>경고</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                주의가 필요한 상황입니다.
              </p>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover>
    </div>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <BasicPopover>
      <div style={{ padding: '16px', maxWidth: '300px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>긴 내용</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.4' }}>
          이 팝오버는 긴 내용을 포함하고 있습니다. 사용자에게 상세한 정보를 제공할 때 유용합니다.
        </p>
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <strong>주요 특징:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>반응형 디자인</li>
            <li>접근성 지원</li>
            <li>키보드 네비게이션</li>
            <li>자동 위치 조정</li>
          </ul>
        </div>
      </div>
    </BasicPopover>
  ),
};
