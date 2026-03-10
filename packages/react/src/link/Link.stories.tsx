import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Link 컴포넌트는 다양한 스타일과 상태를 지원하는 링크입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '링크 내부에 표시될 내용',
      control: 'text',
    },
    href: {
      description: '링크 URL',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      description: '링크의 크기',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: {
        type: { summary: 'LinkSize' },
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
        defaultValue: { summary: 'medium' },
        type: { summary: 'FontWeight' },
      },
    },
    indicator: {
      description: '링크 인디케이터 표시 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
      >
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Sizes</h4>
        <Link href="#" size="xs">
          Extra Small Link
        </Link>
        <Link href="#" size="sm">
          Small Link
        </Link>
        <Link href="#" size="md">
          Medium Link
        </Link>
        <Link href="#" size="lg">
          Large Link
        </Link>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
      >
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Font Weights</h4>
        <Link href="#" weight="light">
          Light Link
        </Link>
        <Link href="#" weight="normal">
          Normal Link
        </Link>
        <Link href="#" weight="medium">
          Medium Link
        </Link>
        <Link href="#" weight="semibold">
          Semibold Link
        </Link>
        <Link href="#" weight="bold">
          Bold Link
        </Link>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}
      >
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Indicator</h4>
        <Link href="#" indicator>
          With Indicator
        </Link>
        <Link href="#" indicator={false}>
          Without Indicator
        </Link>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Link',
    href: '#',
    size: 'md',
    weight: 'medium',
    indicator: true,
  },
};
