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
    as: {
      control: 'select',
      options: ['label', 'p', 'a', 'span', 'div', 'li', 'td', 'th', 'figcaption', 'blockquote', 'cite'],
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
          <Label weight="light">Light 라벨 텍스트</Label>
          <Label weight="normal">Normal 라벨 텍스트</Label>
          <Label weight="medium">Medium 라벨 텍스트</Label>
          <Label weight="semibold">Semibold 라벨 텍스트</Label>
          <Label weight="bold">Bold 라벨 텍스트</Label>
          <Label weight="extrabold">Extrabold 라벨 텍스트</Label>
          <Label weight="black">Black 라벨 텍스트</Label>
        </div>
      </div>

      {/* Semantic Elements */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Elements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Label as="label">Label 요소</Label>
          <Label as="p">Paragraph 요소</Label>
          <Label as="span">Span 요소</Label>
          <Label as="div">Div 요소</Label>
          <Label as="a" href="#" style={{ textDecoration: 'underline' }}>Link 요소</Label>
          <Label as="li">List Item 요소</Label>
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
        </div>
      </div>

      {/* Interactive Example */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Interactive Example</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Label as="label" size="sm" weight="medium">
            사용자 이름
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
          
          <Label as="label" size="sm" weight="medium" style={{ marginTop: '16px' }}>
            이메일 주소
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
        </div>
      </div>
    </div>
  ),
}; 