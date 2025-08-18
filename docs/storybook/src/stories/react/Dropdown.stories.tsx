import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '@cocso-ui/react';

const meta = {
  title: 'react/dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <button style={{ 
          padding: '8px 16px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          background: 'white',
          cursor: 'pointer'
        }}>
          드롭다운 열기
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item>프로필 보기</Dropdown.Item>
          <Dropdown.Item>설정</Dropdown.Item>
          <Dropdown.Item>로그아웃</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <button style={{ 
          padding: '8px 16px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          background: 'white',
          cursor: 'pointer'
        }}>
          메뉴 열기
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item>
            <span style={{ marginRight: '8px' }}>👤</span>
            사용자 정보
          </Dropdown.Item>
          <Dropdown.Item>
            <span style={{ marginRight: '8px' }}>⚙️</span>
            설정
          </Dropdown.Item>
          <Dropdown.Item>
            <span style={{ marginRight: '8px' }}>📊</span>
            대시보드
          </Dropdown.Item>
          <Dropdown.Item>
            <span style={{ marginRight: '8px' }}>❌</span>
            로그아웃
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <button 
          disabled
          style={{ 
            padding: '8px 16px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            background: '#f5f5f5',
            cursor: 'not-allowed',
            opacity: 0.6
          }}
        >
          비활성화된 드롭다운
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item disabled>프로필 보기</Dropdown.Item>
          <Dropdown.Item disabled>설정</Dropdown.Item>
          <Dropdown.Item disabled>로그아웃</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <button style={{ 
          padding: '12px 20px', 
          border: 'none', 
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          커스텀 스타일
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content style={{ 
          minWidth: '200px',
          padding: '8px 0',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e1e5e9'
        }}>
          <Dropdown.Item style={{ 
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            🎨 테마 변경
          </Dropdown.Item>
          <Dropdown.Item style={{ 
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            🔔 알림 설정
          </Dropdown.Item>
          <Dropdown.Item style={{ 
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            🌍 언어 설정
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>기본 드롭다운</h3>
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button style={{ 
              padding: '8px 16px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer'
            }}>
              기본 메뉴
            </button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>옵션 1</Dropdown.Item>
              <Dropdown.Item>옵션 2</Dropdown.Item>
              <Dropdown.Item>옵션 3</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>아이콘이 있는 드롭다운</h3>
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button style={{ 
              padding: '8px 16px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer'
            }}>
              아이콘 메뉴
            </button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>📁 폴더</Dropdown.Item>
              <Dropdown.Item>📄 파일</Dropdown.Item>
              <Dropdown.Item>🔍 검색</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>비활성화된 드롭다운</h3>
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button 
              disabled
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                background: '#f5f5f5',
                cursor: 'not-allowed',
                opacity: 0.6
              }}
            >
              비활성화
            </button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item disabled>비활성화된 옵션</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </div>
    </div>
  ),
};
