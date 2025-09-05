import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Typography 컴포넌트는 일관된 텍스트 스타일링을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '텍스트 내용',
      control: 'text',
    },
    type: {
      description: '타이포그래피 타입',
      control: 'select',
      options: ['custom', 'body', 'display', 'heading'],
      table: {
        defaultValue: { summary: 'custom' },
        type: { summary: "'custom' | 'body' | 'display' | 'heading'" },
      },
    },
    size: {
      description: '크기 (타입에 따라 다름)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string | number | ResponsiveFontSize' },
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
        defaultValue: { summary: 'normal' },
        type: { summary: 'FontWeight' },
      },
    },
    color: {
      description: '텍스트 색상',
      control: 'color',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Typography Component',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Typography type="display" size="lg">
        Display Large
      </Typography>
      <Typography type="heading" size="xl">
        Heading XL
      </Typography>
      <Typography type="body" size="lg">
        Body Large - Lorem ipsum dolor sit amet.
      </Typography>
      <Typography type="custom" size={24}>
        Custom 24px
      </Typography>
    </div>
  ),
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <h3 style={{ marginBottom: '16px' }}>Typography Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>Types & Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Available Sizes</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Default Element</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>display</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>sm, md, lg</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>h1</td>
            <td style={{ padding: '8px' }}>
              <Typography type="display" size="sm">
                Display
              </Typography>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>heading</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>xs, sm, md, lg, xl</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>h2</td>
            <td style={{ padding: '8px' }}>
              <Typography type="heading" size="md">
                Heading
              </Typography>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>body</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>xs, sm, md, lg</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>p</td>
            <td style={{ padding: '8px' }}>
              <Typography type="body" size="md">
                Body text
              </Typography>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>custom</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>number | ResponsiveFontSize</td>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>p</td>
            <td style={{ padding: '8px' }}>
              <Typography type="custom" size={18}>
                Custom
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typography 컴포넌트의 모든 types와 sizes 스펙을 테이블로 보여줍니다.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Playground Typography',
    type: 'custom',
    size: 16,
    weight: 'normal',
    color: '#000000',
  },
};
