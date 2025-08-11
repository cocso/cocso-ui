import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '@cocso-ui/react';

const meta = {
  title: 'react/heading',
  component: Heading,
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

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Hierarchy (asChild)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Heading asChild size="xl"><h1>동해물과 백두산이 마르고 닳도록 (H1)</h1></Heading>
          <Heading asChild size="lg"><h2>하느님이 보우하사 우리나라 만세 (H2)</h2></Heading>
          <Heading asChild size="md"><h3>무궁화 삼천리 화려강산 (H3)</h3></Heading>
          <Heading asChild size="sm"><h4>대한사람 대한으로 길이 보전하세 (H4)</h4></Heading>
          <Heading asChild size="xs"><h5>다람쥐 헌 챗바퀴에 타고파 (H5)</h5></Heading>
          <Heading asChild size="2xs"><h6>까치 까치 까치 까치 까치 (H6)</h6></Heading>
        </div>
      </div>
    </div>
  ),
}; 