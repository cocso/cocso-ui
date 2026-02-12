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
      options: ['primary', 'secondary', 'tertiary', 'success', 'danger', 'warning', 'neutral'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'ButtonVariant' },
      },
    },
    size: {
      description: '버튼의 크기',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
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
    prefix: {
      description: '버튼 앞에 표시될 아이콘 또는 요소',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    suffix: {
      description: '버튼 뒤에 표시될 아이콘 또는 요소',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const sectionStyle = { marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#666' } as const;
const rowStyle = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } as const;
const containerStyle = { display: 'flex', flexDirection: 'column', gap: 24 } as const;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Button 사용법입니다.' } },
  },
  args: {
    children: 'Button',
  },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 사이즈를 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 variant 스타일을 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="neutral">Neutral</Button>
    </div>
  ),
};

export const Shapes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '사용 가능한 모든 shape을 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="circle" svgOnly><PlusIcon /></Button>
    </div>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'disabled, loading 등 다양한 상태를 비교합니다.' } },
  },
  render: () => (
    <div style={rowStyle}>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button disabled loading>Disabled Loading</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'prefix, suffix 아이콘과의 조합을 모든 사이즈에서 보여줍니다.' } },
  },
  render: () => (
    <div style={containerStyle}>
      <div>
        <h4 style={sectionStyle}>With Prefix Icon</h4>
        <div style={rowStyle}>
          <Button size="xs" prefix={<PlusIcon size={14} />}>Add</Button>
          <Button size="sm" prefix={<PlusIcon size={16} />}>Add Item</Button>
          <Button size="md" prefix={<PlusIcon size={18} />}>Add Item</Button>
          <Button size="lg" prefix={<PlusIcon size={20} />}>Add New Item</Button>
        </div>
      </div>

      <div>
        <h4 style={sectionStyle}>With Suffix Icon</h4>
        <div style={rowStyle}>
          <Button size="xs" suffix={<SettingsIcon size={14} />}>Config</Button>
          <Button size="sm" suffix={<SettingsIcon size={16} />}>Settings</Button>
          <Button size="md" suffix={<SettingsIcon size={18} />}>Settings</Button>
          <Button size="lg" suffix={<SettingsIcon size={20} />}>Settings</Button>
        </div>
      </div>

      <div>
        <h4 style={sectionStyle}>With Both Icons</h4>
        <div style={rowStyle}>
          <Button size="xs" prefix={<SearchIcon size={14} />} suffix={<CheckIcon size={14} />}>Find</Button>
          <Button size="sm" prefix={<SearchIcon size={16} />} suffix={<CheckIcon size={16} />}>Search</Button>
          <Button size="md" prefix={<SearchIcon size={18} />} suffix={<CheckIcon size={18} />}>Search & Verify</Button>
          <Button size="lg" prefix={<SearchIcon size={20} />} suffix={<CheckIcon size={20} />}>Search & Verify</Button>
        </div>
      </div>

      <div>
        <h4 style={sectionStyle}>Icon Only (SVG Only)</h4>
        <div style={rowStyle}>
          <Button size="xs" svgOnly><PlusIcon size={14} /></Button>
          <Button size="sm" svgOnly><PlusIcon size={16} /></Button>
          <Button size="md" svgOnly><PlusIcon size={18} /></Button>
          <Button size="lg" svgOnly><PlusIcon size={20} /></Button>
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    shape: 'square',
    disabled: false,
    loading: false,
    svgOnly: false,
  },
};
