import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['x-small', 'small', 'medium', 'large'] },
    variant: { control: 'select', options: ['inline', 'current', 'plain'] },
    indicator: { control: 'boolean' },
  },
  args: {
    children: '링크 텍스트',
    href: '#',
    size: 'medium',
    variant: 'inline',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Link href="#" variant="inline">Inline</Link>
      <span style={{ color: 'oklch(0.6 0.15 250)' }}>
        <Link href="#" variant="current">Current</Link>
      </span>
      <Link href="#" variant="plain">Plain</Link>
    </div>
  ),
};

export const WithExternalIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Link href="#" variant="inline">
        외부 링크 <Link.ExternalIcon />
      </Link>
      <span style={{ color: 'oklch(0.6 0.15 250)' }}>
        <Link href="#" variant="current">
          외부 링크 <Link.ExternalIcon />
        </Link>
      </span>
      <Link href="#" variant="plain">
        외부 링크 <Link.ExternalIcon />
      </Link>
    </div>
  ),
};
