import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
    indicator: { control: 'boolean' },
  },
  args: {
    children: '링크 텍스트',
    href: '#',
    size: 'medium',
    indicator: true,
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutIndicator: Story = {
  args: { indicator: false },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Link href="#" size="x-small">x-small</Link>
      <Link href="#" size="small">small</Link>
      <Link href="#" size="medium">medium</Link>
      <Link href="#" size="large">large</Link>
    </div>
  ),
};
