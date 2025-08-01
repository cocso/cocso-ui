import type { Meta, StoryObj } from '@storybook/react';
import { Body } from '@cocso-ui/react';

const meta = {
  title: 'react/body',
  component: Body,
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
} satisfies Meta<typeof Body>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '다람쥐 헌 챗바퀴에 타고파.',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Body size="lg">동해물과 백두산이 마르고 닳도록</Body>
          <Body size="md">하느님이 보우하사 우리나라 만세</Body>
          <Body size="sm">무궁화 삼천리 화려강산</Body>
          <Body size="xs">대한사람 대한으로 길이 보전하세</Body>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Elements (asChild)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Body asChild><p>다람쥐 헌 챗바퀴에 타고파</p></Body>
          <Body asChild color="#2563EB"><a href="#">한글 링크 텍스트</a></Body>
          <Body asChild weight="medium"><label>폼 라벨 텍스트</label></Body>
          <Body asChild size="sm" color="#6B7280"><span>인라인 한글 텍스트</span></Body>
          <Body asChild style={{ borderLeft: '4px solid #E5E7EB', paddingLeft: '16px' }}>
            <blockquote>인용구 한글 텍스트 예시</blockquote>
          </Body>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Article Example</h3>
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Body size="lg">
            동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세.
            무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세.
          </Body>
          <Body size="md">
            다람쥐 헌 챗바퀴에 타고파. 까치 까치 까치 까치 까치 까치 까치 까치 까치 까치.
            토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼.
          </Body>
          <Body size="sm" color="#6B7280">
            우리는 민족의 자유와 독립을 위해 싸워왔으며, 앞으로도 평화와 번영을 위해 노력할 것입니다.
          </Body>
        </div>
      </div>
    </div>
  ),
};
