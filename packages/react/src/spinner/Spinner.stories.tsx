import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spinner 컴포넌트는 로딩 상태를 나타내는 회전하는 인디케이터입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: '스피너의 크기',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'SpinnerSize' },
      },
    },
    color: {
      description: '스피너의 색상',
      control: 'select',
      options: ['primary', 'neutral', 'white'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'SpinnerColor' },
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner color="primary" />
      <Spinner color="neutral" />
      <div style={{ backgroundColor: '#333', padding: '12px', borderRadius: '4px' }}>
        <Spinner color="white" />
      </div>
    </div>
  ),
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '16px' }}>Spinner Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Dimensions</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Border Width</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>sm</td>
            <td style={{ padding: '8px' }}>20px</td>
            <td style={{ padding: '8px' }}>2px</td>
            <td style={{ padding: '8px' }}>
              <Spinner size="sm" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>md</td>
            <td style={{ padding: '8px' }}>24px</td>
            <td style={{ padding: '8px' }}>3px</td>
            <td style={{ padding: '8px' }}>
              <Spinner size="md" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>lg</td>
            <td style={{ padding: '8px' }}>32px</td>
            <td style={{ padding: '8px' }}>4px</td>
            <td style={{ padding: '8px' }}>
              <Spinner size="lg" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>xl</td>
            <td style={{ padding: '8px' }}>40px</td>
            <td style={{ padding: '8px' }}>5px</td>
            <td style={{ padding: '8px' }}>
              <Spinner size="xl" />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginBottom: '12px' }}>Colors</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Color</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Use Case</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>primary</td>
            <td style={{ padding: '8px' }}>기본 로딩</td>
            <td style={{ padding: '8px' }}>
              <Spinner color="primary" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>neutral</td>
            <td style={{ padding: '8px' }}>중립적 로딩</td>
            <td style={{ padding: '8px' }}>
              <Spinner color="neutral" />
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>white</td>
            <td style={{ padding: '8px' }}>어두운 배경</td>
            <td style={{ padding: '8px', backgroundColor: '#333', borderRadius: '4px' }}>
              <Spinner color="white" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinner 컴포넌트의 모든 sizes와 colors 스펙을 테이블로 보여줍니다.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};
