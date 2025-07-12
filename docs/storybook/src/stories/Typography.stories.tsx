import type { Meta, StoryObj } from '@storybook/react';
import { Button, Heading, Display, Body } from '@cocso-ui/react';

const meta = {
  title: 'Foundation/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Pretendard 폰트와 CSS reset이 적용된 타이포그래피 시스템입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PretendardFont: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
          Pretendard 폰트 적용 확인
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <Display size="lg">큰 제목 텍스트 (Display Large)</Display>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
              font-family: Pretendard Variable
            </p>
          </div>
          
          <div>
            <Heading size="xl">헤딩 텍스트 예시 (Heading XL)</Heading>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
              한글, 영문, 숫자가 조화롭게 표시됩니다
            </p>
          </div>
          
          <div>
            <Body size="lg">
              본문 텍스트입니다. Pretendard는 한국어와 영어를 아우르는 
              모던한 글꼴입니다. Numbers: 0123456789
            </Body>
          </div>
          
          <div>
            <Body size="md">
              중간 크기 본문 텍스트입니다. 읽기 편하고 깔끔한 타이포그래피를 
              제공합니다. Lorem ipsum dolor sit amet.
            </Body>
          </div>
          
          <div>
            <Body size="sm">
              작은 크기 본문 텍스트입니다. 부가 정보나 캡션에 사용됩니다.
            </Body>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const FontWeightVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
        폰트 두께 변화 (Font Weight Variations)
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Body fontWeight="normal" size="lg">
          일반 두께 텍스트 (Normal Weight) - 가나다라마바사
        </Body>
        
        <Body fontWeight="medium" size="lg">
          중간 두께 텍스트 (Medium Weight) - 가나다라마바사
        </Body>
        
        <Body fontWeight="semibold" size="lg">
          세미볼드 텍스트 (Semibold Weight) - 가나다라마바사
        </Body>
        
        <Body fontWeight="bold" size="lg">
          볼드 텍스트 (Bold Weight) - 가나다라마바사
        </Body>
      </div>
    </div>
  ),
};

export const MixedContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Display size="lg">COCSO UI 디자인 시스템</Display>
        <Body size="md" color="#666" style={{ marginTop: '8px' }}>
          모던하고 일관된 사용자 경험을 위한 컴포넌트 라이브러리
        </Body>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="primary">시작하기</Button>
        <Button variant="secondary">문서 보기</Button>
        <Button variant="text">GitHub</Button>
      </div>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <Heading size="md" style={{ marginBottom: '16px' }}>
          주요 특징
        </Heading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Body size="md">
            • TypeScript 기반의 타입 안전한 컴포넌트
          </Body>
          <Body size="md">
            • Pretendard 폰트로 최적화된 한글 타이포그래피
          </Body>
          <Body size="md">
            • 접근성과 사용성을 고려한 디자인
          </Body>
          <Body size="md">
            • Storybook을 통한 컴포넌트 문서화
          </Body>
        </div>
      </div>
    </div>
  ),
};

export const CSSResetDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
          CSS Reset 적용 확인
        </h2>
        <Body size="md" color="#666">
          모든 기본 스타일이 리셋되어 일관된 디자인을 제공합니다.
        </Body>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            네이티브 HTML 요소들
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p>단락(p) 요소 - 기본 마진/패딩 제거됨</p>
            <h4>제목(h4) 요소 - 기본 마진 제거됨</h4>
            <ul>
              <li>리스트 아이템 1 - 기본 스타일 제거됨</li>
              <li>리스트 아이템 2 - 기본 스타일 제거됨</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            폼 요소들
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="입력 필드"
              style={{ 
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <button 
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              버튼
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
}; 