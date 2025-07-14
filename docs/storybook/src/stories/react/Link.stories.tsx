import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '@cocso-ui/react';

const meta = {
  title: 'React/Link',
  component: Link,
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
    weight: {
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
    },
    indicator: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '링크 텍스트',
    href: '#',
    size: 'md',
    weight: 'normal',
    indicator: true,
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="#" size="lg">큰 링크 텍스트</Link>
          <Link href="#" size="md">중간 링크 텍스트</Link>
          <Link href="#" size="sm">작은 링크 텍스트</Link>
          <Link href="#" size="xs">매우 작은 링크 텍스트</Link>
        </div>
      </div>

      {/* All Weights */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Font Weights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="#" weight="thin">Thin 링크</Link>
          <Link href="#" weight="extralight">Extra Light 링크</Link>
          <Link href="#" weight="light">Light 링크</Link>
          <Link href="#" weight="normal">Normal 링크</Link>
          <Link href="#" weight="medium">Medium 링크</Link>
          <Link href="#" weight="semibold">Semibold 링크</Link>
          <Link href="#" weight="bold">Bold 링크</Link>
          <Link href="#" weight="extrabold">Extra Bold 링크</Link>
          <Link href="#" weight="black">Black 링크</Link>
        </div>
      </div>

      {/* Indicator Variations */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Indicator</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="#" indicator={true}>인디케이터가 있는 링크</Link>
          <Link href="#" indicator={false}>인디케이터가 없는 링크</Link>
        </div>
      </div>

      {/* asChild Example */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>asChild Example</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link asChild href="#">
            <button type="button">버튼으로 렌더링된 링크</button>
          </Link>
          <Link asChild href="#">
            <span>스팬으로 렌더링된 링크</span>
          </Link>
        </div>
      </div>

      {/* Mixed Examples */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Mixed Examples</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="#" size="lg" weight="bold" indicator={true}>큰 굵은 링크 (인디케이터 있음)</Link>
          <Link href="#" size="sm" weight="light" indicator={false}>작은 가는 링크 (인디케이터 없음)</Link>
          <Link href="#" size="md" weight="semibold" indicator={true}>중간 세미볼드 링크</Link>
        </div>
      </div>
    </div>
  ),
}; 