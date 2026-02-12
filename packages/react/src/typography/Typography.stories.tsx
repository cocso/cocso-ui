import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Typography 컴포넌트는 일관된 텍스트 스타일링을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '텍스트 내용',
      control: 'text',
    },
    type: {
      description: '타이포그래피 타입',
      control: 'select',
      options: ['custom', 'body', 'display', 'heading'],
      table: {
        defaultValue: { summary: 'custom' },
        type: { summary: "'custom' | 'body' | 'display' | 'heading'" },
      },
    },
    size: {
      description: '크기 (타입에 따라 다름)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string | number | ResponsiveFontSize' },
      },
    },
    weight: {
      description: '폰트 굵기',
      control: 'select',
      options: [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
      table: {
        defaultValue: { summary: 'normal' },
        type: { summary: 'FontWeight' },
      },
    },
    color: {
      description: '텍스트 색상',
      control: 'color',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' } as const;
const sectionStyle = { marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#666' } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Typography 사용법입니다.' } },
  },
  render: () => (
    <Typography type="body" size="md">
      기본 텍스트입니다.
    </Typography>
  ),
};

export const Display: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Display 타입의 모든 사이즈를 비교합니다. 대형 제목이나 히어로 영역에 사용됩니다.' } },
  },
  render: () => (
    <div style={containerStyle}>
      <h4 style={sectionStyle}>Display</h4>
      <Typography type="display" size="lg">
        Display Large
      </Typography>
      <Typography type="display" size="md">
        Display Medium
      </Typography>
      <Typography type="display" size="sm">
        Display Small
      </Typography>
    </div>
  ),
};

export const Heading: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Heading 타입의 모든 사이즈를 비교합니다. 섹션 제목에 사용됩니다.' } },
  },
  render: () => (
    <div style={containerStyle}>
      <h4 style={sectionStyle}>Heading</h4>
      <Typography type="heading" size="xl">
        Heading XL
      </Typography>
      <Typography type="heading" size="lg">
        Heading Large
      </Typography>
      <Typography type="heading" size="md">
        Heading Medium
      </Typography>
      <Typography type="heading" size="sm">
        Heading Small
      </Typography>
      <Typography type="heading" size="xs">
        Heading XS
      </Typography>
    </div>
  ),
};

export const Body: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Body 타입의 모든 사이즈를 비교합니다. 본문 텍스트에 사용됩니다.' } },
  },
  render: () => (
    <div style={containerStyle}>
      <h4 style={sectionStyle}>Body</h4>
      <Typography type="body" size="lg">
        Body Large
      </Typography>
      <Typography type="body" size="md">
        Body Medium
      </Typography>
      <Typography type="body" size="sm">
        Body Small
      </Typography>
      <Typography type="body" size="xs">
        Body XS
      </Typography>
    </div>
  ),
};

export const Weights: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 폰트 굵기를 비교합니다.' } },
  },
  render: () => (
    <div style={containerStyle}>
      <h4 style={sectionStyle}>Font Weights</h4>
      <Typography type="body" size="md" weight="thin">
        Thin (100)
      </Typography>
      <Typography type="body" size="md" weight="extralight">
        Extra Light (200)
      </Typography>
      <Typography type="body" size="md" weight="light">
        Light (300)
      </Typography>
      <Typography type="body" size="md" weight="normal">
        Normal (400)
      </Typography>
      <Typography type="body" size="md" weight="medium">
        Medium (500)
      </Typography>
      <Typography type="body" size="md" weight="semibold">
        Semibold (600)
      </Typography>
      <Typography type="body" size="md" weight="bold">
        Bold (700)
      </Typography>
      <Typography type="body" size="md" weight="extrabold">
        Extra Bold (800)
      </Typography>
      <Typography type="body" size="md" weight="black">
        Black (900)
      </Typography>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Typography',
    type: 'custom',
    size: 16,
    weight: 'normal',
    color: '#000000',
  },
};
