import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@cocso-ui/react';

const meta = {
  title: 'React/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'xs'],
    },
    color: {
      control: 'color',
    },
    weight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '라벨 텍스트',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label size="lg">큰 라벨 텍스트 (lg)</Label>
          <Label size="md">중간 라벨 텍스트 (md)</Label>
          <Label size="sm">작은 라벨 텍스트 (sm)</Label>
          <Label size="xs">매우 작은 라벨 텍스트 (xs)</Label>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Font Weights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label weight="thin">Thin 라벨 텍스트</Label>
          <Label weight="extralight">Extralight 라벨 텍스트</Label>
          <Label weight="light">Light 라벨 텍스트</Label>
          <Label weight="normal">Normal 라벨 텍스트</Label>
          <Label weight="medium">Medium 라벨 텍스트</Label>
          <Label weight="semibold">Semibold 라벨 텍스트</Label>
          <Label weight="bold">Bold 라벨 텍스트</Label>
          <Label weight="extrabold">Extrabold 라벨 텍스트</Label>
          <Label weight="black">Black 라벨 텍스트</Label>
        </div>
      </div>

      {/* Semantic Elements with asChild */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Elements (asChild)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label asChild><label>Label 요소</label></Label>
          <Label asChild><p>Paragraph 요소</p></Label>
          <Label asChild><span>Span 요소</span></Label>
          <Label asChild><div>Div 요소</div></Label>
          <Label asChild><a href="#" style={{ textDecoration: 'underline' }}>Link 요소</a></Label>
          <Label asChild><li>List Item 요소</li></Label>
          <Label asChild><td>Table Data 요소</td></Label>
          <Label asChild><th>Table Header 요소</th></Label>
          <Label asChild><figcaption>Figure Caption 요소</figcaption></Label>
          <Label asChild><blockquote>Blockquote 요소</blockquote></Label>
          <Label asChild><cite>Citation 요소</cite></Label>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Colors</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label color="#000000">검은색 라벨</Label>
          <Label color="#666666">회색 라벨</Label>
          <Label color="#0066cc">파란색 라벨</Label>
          <Label color="#cc0000">빨간색 라벨</Label>
          <Label color="#00cc00">초록색 라벨</Label>
          <Label color="#ff6600">주황색 라벨</Label>
          <Label color="#9933cc">보라색 라벨</Label>
        </div>
      </div>

      {/* Size and Weight Combinations */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Size and Weight Combinations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label size="lg" weight="bold">큰 굵은 라벨 (lg + bold)</Label>
          <Label size="md" weight="semibold">중간 세미볼드 라벨 (md + semibold)</Label>
          <Label size="sm" weight="medium">작은 미디엄 라벨 (sm + medium)</Label>
          <Label size="xs" weight="normal">매우 작은 일반 라벨 (xs + normal)</Label>
        </div>
      </div>

      {/* Interactive Example */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Interactive Example</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Label asChild size="sm" weight="medium">
            <label>사용자 이름</label>
          </Label>
          <input 
            type="text" 
            placeholder="이름을 입력하세요" 
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px'
            }} 
          />
          
          <Label asChild size="sm" weight="medium" style={{ marginTop: '16px' }}>
            <label>이메일 주소</label>
          </Label>
          <input 
            type="email" 
            placeholder="이메일을 입력하세요" 
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px'
            }} 
          />

          <Label asChild size="xs" weight="normal" style={{ marginTop: '16px', color: '#666' }}>
            <label>선택사항</label>
          </Label>
          <input 
            type="text" 
            placeholder="선택사항을 입력하세요" 
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px'
            }} 
          />
        </div>
      </div>

      {/* Form Layout Example */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Form Layout Example</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
          <div>
            <Label asChild size="sm" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
              <label>이름</label>
            </Label>
            <input 
              type="text" 
              style={{ 
                width: '100%',
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }} 
            />
          </div>
          <div>
            <Label asChild size="sm" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
              <label>성</label>
            </Label>
            <input 
              type="text" 
              style={{ 
                width: '100%',
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }} 
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Label asChild size="sm" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
              <label>이메일</label>
            </Label>
            <input 
              type="email" 
              style={{ 
                width: '100%',
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  ),
}; 