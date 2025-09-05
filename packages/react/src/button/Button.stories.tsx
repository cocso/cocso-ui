import { CheckIcon, PlusIcon, SearchIcon, SettingsIcon } from '@cocso-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button 컴포넌트는 다양한 스타일과 상태를 지원하는 버튼입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '버튼 내부에 표시될 내용',
      control: 'text',
    },
    variant: {
      description: '버튼의 스타일 타입',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'neutral'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'ButtonVariant' },
      },
    },
    size: {
      description: '버튼의 크기',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'ButtonSize' },
      },
    },
    shape: {
      description: '버튼의 모양',
      control: 'select',
      options: ['square', 'rounded', 'circle'],
      table: {
        defaultValue: { summary: 'square' },
        type: { summary: 'ButtonShape' },
      },
    },
    disabled: {
      description: '버튼 비활성화 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    loading: {
      description: '로딩 상태 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    svgOnly: {
      description: '아이콘만 표시하는 버튼인지 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="success">Success</Button>
      <Button variant="error">Error</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="neutral">Neutral</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button prefix={<PlusIcon />}>Add</Button>
      <Button suffix={<SettingsIcon />}>Settings</Button>
      <Button prefix={<SearchIcon />} suffix={<CheckIcon />}>
        Search & Check
      </Button>
      <Button svgOnly>
        <PlusIcon />
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};

export const SpecTable: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <h3 style={{ marginBottom: '16px' }}>Button Specifications</h3>

      <h4 style={{ marginBottom: '12px' }}>Variants</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Variant</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>primary</td>
            <td style={{ padding: '8px' }}>주요 액션</td>
            <td style={{ padding: '8px' }}>
              <Button variant="primary">Primary</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>secondary</td>
            <td style={{ padding: '8px' }}>보조 액션</td>
            <td style={{ padding: '8px' }}>
              <Button variant="secondary">Secondary</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>tertiary</td>
            <td style={{ padding: '8px' }}>3차 액션</td>
            <td style={{ padding: '8px' }}>
              <Button variant="tertiary">Tertiary</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>success</td>
            <td style={{ padding: '8px' }}>성공 액션</td>
            <td style={{ padding: '8px' }}>
              <Button variant="success">Success</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>error</td>
            <td style={{ padding: '8px' }}>오류/삭제</td>
            <td style={{ padding: '8px' }}>
              <Button variant="error">Error</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>warning</td>
            <td style={{ padding: '8px' }}>경고</td>
            <td style={{ padding: '8px' }}>
              <Button variant="warning">Warning</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>neutral</td>
            <td style={{ padding: '8px' }}>중립</td>
            <td style={{ padding: '8px' }}>
              <Button variant="neutral">Neutral</Button>
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Height</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Font Size</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>xs</td>
            <td style={{ padding: '8px' }}>28px</td>
            <td style={{ padding: '8px' }}>12px</td>
            <td style={{ padding: '8px' }}>
              <Button size="xs">XS</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>sm</td>
            <td style={{ padding: '8px' }}>32px</td>
            <td style={{ padding: '8px' }}>14px</td>
            <td style={{ padding: '8px' }}>
              <Button size="sm">SM</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>md</td>
            <td style={{ padding: '8px' }}>40px</td>
            <td style={{ padding: '8px' }}>14px</td>
            <td style={{ padding: '8px' }}>
              <Button size="md">MD</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>lg</td>
            <td style={{ padding: '8px' }}>48px</td>
            <td style={{ padding: '8px' }}>16px</td>
            <td style={{ padding: '8px' }}>
              <Button size="lg">LG</Button>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px', fontFamily: 'monospace' }}>xl</td>
            <td style={{ padding: '8px' }}>56px</td>
            <td style={{ padding: '8px' }}>16px</td>
            <td style={{ padding: '8px' }}>
              <Button size="xl">XL</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button 컴포넌트의 모든 variants와 sizes 스펙을 테이블로 보여줍니다.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Playground Button',
    variant: 'primary',
    size: 'md',
    shape: 'square',
    disabled: false,
    loading: false,
    svgOnly: false,
  },
};
