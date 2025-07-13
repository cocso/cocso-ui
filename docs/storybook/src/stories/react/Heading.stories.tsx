import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '@cocso-ui/react';

const meta = {
  title: 'React/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs', '2xs'],
    },
    color: {
      control: 'color',
    },
    weight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '다람쥐 헌 챗바퀴에 타고파',
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Heading size="xl">동해물과 백두산이 마르고 닳도록</Heading>
          <Heading size="lg">하느님이 보우하사 우리나라 만세</Heading>
          <Heading size="md">무궁화 삼천리 화려강산</Heading>
          <Heading size="sm">대한사람 대한으로 길이 보전하세</Heading>
          <Heading size="xs">다람쥐 헌 챗바퀴에 타고파</Heading>
          <Heading size="2xs">까치 까치 까치 까치 까치</Heading>
        </div>
      </div>

      {/* Semantic Hierarchy */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Hierarchy</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Heading as="h1" size="xl">동해물과 백두산이 마르고 닳도록 (H1)</Heading>
          <Heading as="h2" size="lg">하느님이 보우하사 우리나라 만세 (H2)</Heading>
          <Heading as="h3" size="md">무궁화 삼천리 화려강산 (H3)</Heading>
          <Heading as="h4" size="sm">대한사람 대한으로 길이 보전하세 (H4)</Heading>
          <Heading as="h5" size="xs">다람쥐 헌 챗바퀴에 타고파 (H5)</Heading>
          <Heading as="h6" size="2xs">까치 까치 까치 까치 까치 (H6)</Heading>
        </div>
      </div>
    </div>
  ),
}; 