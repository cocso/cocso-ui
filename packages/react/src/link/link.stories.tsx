import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    indicator: { control: 'boolean' },
  },
  args: {
    children: '링크 텍스트',
    href: '#',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoIndicator: Story = {
  args: { indicator: false },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Link href="#" size="xs">XS 링크</Link>
      <Link href="#" size="sm">SM 링크</Link>
      <Link href="#" size="md">MD 링크</Link>
      <Link href="#" size="lg">LG 링크</Link>
    </div>
  ),
};
