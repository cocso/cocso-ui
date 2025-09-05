import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

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

export const Default: Story = {
  args: {
    children: 'Link',
    href: '#',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <Link size="xs" href="#">
        Extra Small Link
      </Link>
      <Link size="sm" href="#">
        Small Link
      </Link>
      <Link size="md" href="#">
        Medium Link
      </Link>
      <Link size="lg" href="#">
        Large Link
      </Link>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <Link weight="light" href="#">
        Light Link
      </Link>
      <Link weight="normal" href="#">
        Normal Link
      </Link>
      <Link weight="medium" href="#">
        Medium Link
      </Link>
      <Link weight="semibold" href="#">
        Semibold Link
      </Link>
      <Link weight="bold" href="#">
        Bold Link
      </Link>
    </div>
  ),
};

export const WithoutIndicator: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <Link indicator href="#">
        With Indicator
      </Link>
      <Link indicator={false} href="#">
        Without Indicator
      </Link>
    </div>
  ),
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px' }}>Link Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Font Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>xs</td>
            <td style={{ padding: '8px' }}>12px</td>
            <td style={{ padding: '8px' }}>
              <Link size="xs" href="#">
                XS Link
              </Link>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>sm</td>
            <td style={{ padding: '8px' }}>14px</td>
            <td style={{ padding: '8px' }}>
              <Link size="sm" href="#">
                SM Link
              </Link>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>md</td>
            <td style={{ padding: '8px' }}>16px</td>
            <td style={{ padding: '8px' }}>
              <Link size="md" href="#">
                MD Link
              </Link>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>lg</td>
            <td style={{ padding: '8px' }}>18px</td>
            <td style={{ padding: '8px' }}>
              <Link size="lg" href="#">
                LG Link
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginBottom: '12px' }}>Props</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>indicator</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>boolean</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>true</td>
            <td style={{ padding: '8px' }}>링크 인디케이터 표시 여부</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>asChild</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>boolean</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>false</td>
            <td style={{ padding: '8px' }}>자식 컴포넌트로 렌더링</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Link 컴포넌트의 모든 sizes와 props 스펙을 테이블로 보여줍니다.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Playground Link',
    href: '#',
    size: 'md',
    weight: 'medium',
    indicator: true,
  },
};
