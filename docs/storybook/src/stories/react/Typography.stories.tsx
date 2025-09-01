import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@cocso-ui/react';

const meta = {
  title: 'react/typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
    },
    type: {
      control: 'select',
      options: ['custom', 'body', 'display', 'heading'],
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'xs', 'xl'],
    },
    color: {
      control: 'color',
    },
    weight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '다람쥐 헌 챗바퀴에 타고파.',
  },
};

export const CustomType: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Custom Type (숫자 사이즈)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography type="custom" size={24}>큰 텍스트 (24px)</Typography>
          <Typography type="custom" size={18}>중간 텍스트 (18px)</Typography>
          <Typography type="custom" size={16}>기본 텍스트 (16px)</Typography>
          <Typography type="custom" size={14}>작은 텍스트 (14px)</Typography>
          <Typography type="custom" size={12}>매우 작은 텍스트 (12px)</Typography>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Responsive Custom Size</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography type="custom" size={{base: 16, tablet: 20}}>반응형 텍스트 (16px → 20px)</Typography>
          <Typography type="custom" size={{base: 18, tablet: 24, desktop: 32}}>반응형 텍스트 (18px → 24px → 32px)</Typography>
        </div>
      </div>
    </div>
  ),
};

export const BodyType: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Body Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography type="body" size="lg">큰 본문 (lg)</Typography>
          <Typography type="body" size="md">중간 본문 (md)</Typography>
          <Typography type="body" size="sm">작은 본문 (sm)</Typography>
          <Typography type="body" size="xs">매우 작은 본문 (xs)</Typography>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Article Example</h3>
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography type="body" size="lg">
            동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세.
            무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세.
          </Typography>
          <Typography type="body" size="md">
            다람쥐 헌 챗바퀴에 타고파. 까치 까치 까치 까치 까치 까치 까치 까치 까치 까치.
            토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼.
          </Typography>
          <Typography type="body" size="sm" color="#6B7280">
            우리는 민족의 자유와 독립을 위해 싸워왔으며, 앞으로도 평화와 번영을 위해 노력할 것입니다.
          </Typography>
        </div>
      </div>
    </div>
  ),
};

export const DisplayType: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Display Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography type="display" size="lg">큰 디스플레이 (lg)</Typography>
          <Typography type="display" size="md">중간 디스플레이 (md)</Typography>
          <Typography type="display" size="sm">작은 디스플레이 (sm)</Typography>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Hero Section Example
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          <Typography type="display" size="lg" color="#1F2937">
            다람쥐 헌 챗바퀴에 타고파
          </Typography>
          <Typography type="display" size="md" color="#6B7280">
            까치 까치 까치 까치 까치 까치 까치 까치 까치 까치
          </Typography>
          <Typography type="display" size="sm" color="#9CA3AF">
            토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼 토끼
          </Typography>
        </div>
      </div>
    </div>
  ),
};

export const HeadingType: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Heading Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography type="heading" size="xl">매우 큰 제목 (xl)</Typography>
          <Typography type="heading" size="lg">큰 제목 (lg)</Typography>
          <Typography type="heading" size="md">중간 제목 (md)</Typography>
          <Typography type="heading" size="sm">작은 제목 (sm)</Typography>
          <Typography type="heading" size="xs">매우 작은 제목 (xs)</Typography>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Hierarchy</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography type="heading" size="xl">동해물과 백두산이 마르고 닳도록 (H1)</Typography>
          <Typography type="heading" size="lg">하느님이 보우하사 우리나라 만세 (H2)</Typography>
          <Typography type="heading" size="md">무궁화 삼천리 화려강산 (H3)</Typography>
          <Typography type="heading" size="sm">대한사람 대한으로 길이 보전하세 (H4)</Typography>
          <Typography type="heading" size="xs">다람쥐 헌 챗바퀴에 타고파 (H5)</Typography>
        </div>
      </div>
    </div>
  ),
};

export const SemanticElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Elements (asChild)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography type="body" asChild><p>다람쥐 헌 챗바퀴에 타고파</p></Typography>
          <Typography type="body" asChild color="#2563EB"><a href="#">한글 링크 텍스트</a></Typography>
          <Typography type="body" asChild weight="medium"><label>폼 라벨 텍스트</label></Typography>
          <Typography type="body" asChild size="sm" color="#6B7280"><span>인라인 한글 텍스트</span></Typography>
          <Typography type="body" asChild style={{ borderLeft: '4px solid #E5E7EB', paddingLeft: '16px' }}>
            <blockquote>인용구 한글 텍스트 예시</blockquote>
          </Typography>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Mixed Types Example</h3>
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Typography type="display" size="lg" color="#1F2937">
            웹사이트 제목
          </Typography>
          <Typography type="heading" size="xl" color="#374151">
            섹션 제목
          </Typography>
          <Typography type="body" size="lg">
            이 섹션에서는 다양한 타이포그래피 스타일을 보여줍니다. 
            각각의 타입은 고유한 용도와 스타일을 가지고 있습니다.
          </Typography>
          <Typography type="body" size="md">
            Body 타입은 본문 텍스트에 적합하며, 가독성을 위해 최적화되어 있습니다.
            다양한 사이즈 옵션을 통해 계층 구조를 만들 수 있습니다.
          </Typography>
          <Typography type="heading" size="md" color="#4B5563">
            하위 제목
          </Typography>
          <Typography type="body" size="sm" color="#6B7280">
            작은 텍스트는 부가 정보나 메타데이터를 표시할 때 유용합니다.
            색상과 함께 사용하면 시각적 계층을 더욱 명확하게 만들 수 있습니다.
          </Typography>
        </div>
      </div>
    </div>
  ),
};
