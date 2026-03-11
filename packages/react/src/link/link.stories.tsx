import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
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
      <Link href="#" size="x-small">XS 링크</Link>
      <Link href="#" size="small">SM 링크</Link>
      <Link href="#" size="medium">MD 링크</Link>
      <Link href="#" size="large">LG 링크</Link>
    </div>
  ),
};
