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

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* Variants */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="success">Success</Button>
          <Button variant="error">Error</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="neutral">Neutral</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button prefix={<PlusIcon />}>Add Item</Button>
          <Button suffix={<SettingsIcon />}>Settings</Button>
          <Button prefix={<SearchIcon />} suffix={<CheckIcon />}>Search & Verify</Button>
          <Button svgOnly size="md"><PlusIcon /></Button>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>States</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button disabled loading>Disabled Loading</Button>
        </div>
      </div>

      {/* Shapes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Shapes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button shape="square">Square</Button>
          <Button shape="rounded">Rounded</Button>
          <Button shape="circle" svgOnly><PlusIcon /></Button>
        </div>
      </div>
    </div>
  ),
};

export const SizeWithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '모든 사이즈에서 prefix, suffix 아이콘과의 조합을 보여줍니다. xs 사이즈에서 개선된 간격을 확인할 수 있습니다.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Text Only */}
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>Text Only</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      {/* With Prefix */}
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>With Prefix Icon</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs" prefix={<PlusIcon size={14} />}>Add</Button>
          <Button size="sm" prefix={<PlusIcon size={16} />}>Add Item</Button>
          <Button size="md" prefix={<PlusIcon size={18} />}>Add Item</Button>
          <Button size="lg" prefix={<PlusIcon size={20} />}>Add New Item</Button>
          <Button size="xl" prefix={<PlusIcon size={22} />}>Add New Item</Button>
        </div>
      </div>

      {/* With Suffix */}
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>With Suffix Icon</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs" suffix={<SettingsIcon size={14} />}>Config</Button>
          <Button size="sm" suffix={<SettingsIcon size={16} />}>Settings</Button>
          <Button size="md" suffix={<SettingsIcon size={18} />}>Settings</Button>
          <Button size="lg" suffix={<SettingsIcon size={20} />}>Settings</Button>
          <Button size="xl" suffix={<SettingsIcon size={22} />}>Settings</Button>
        </div>
      </div>

      {/* With Both Icons */}
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>With Both Icons</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs" prefix={<SearchIcon size={14} />} suffix={<CheckIcon size={14} />}>Find</Button>
          <Button size="sm" prefix={<SearchIcon size={16} />} suffix={<CheckIcon size={16} />}>Search</Button>
          <Button size="md" prefix={<SearchIcon size={18} />} suffix={<CheckIcon size={18} />}>Search & Verify</Button>
          <Button size="lg" prefix={<SearchIcon size={20} />} suffix={<CheckIcon size={20} />}>Search & Verify</Button>
          <Button size="xl" prefix={<SearchIcon size={22} />} suffix={<CheckIcon size={22} />}>Search & Verify</Button>
        </div>
      </div>

      {/* Icon Only */}
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>Icon Only (SVG Only)</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xs" svgOnly><PlusIcon size={14} /></Button>
          <Button size="sm" svgOnly><PlusIcon size={16} /></Button>
          <Button size="md" svgOnly><PlusIcon size={18} /></Button>
          <Button size="lg" svgOnly><PlusIcon size={20} /></Button>
          <Button size="xl" svgOnly><PlusIcon size={22} /></Button>
        </div>
      </div>
    </div>
  ),
};

export const VariantShowcase: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '모든 variant에서 다양한 조합을 보여줍니다.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'neutral'].map((variant) => (
        <div key={variant}>
          <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666', textTransform: 'capitalize' }}>
            {variant}
          </h4>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant={variant as any}>Button</Button>
            <Button variant={variant as any} prefix={<PlusIcon size={16} />}>With Prefix</Button>
            <Button variant={variant as any} suffix={<SettingsIcon size={16} />}>With Suffix</Button>
            <Button variant={variant as any} prefix={<SearchIcon size={16} />} suffix={<CheckIcon size={16} />}>Both Icons</Button>
            <Button variant={variant as any} disabled>Disabled</Button>
            <Button variant={variant as any} loading>Loading</Button>
            <Button variant={variant as any} svgOnly><PlusIcon size={16} /></Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const StatesCombinations: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '다양한 상태 조합에서의 버튼 동작을 보여줍니다.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>Loading States</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button loading>Loading</Button>
          <Button loading prefix={<PlusIcon size={16} />}>Loading with Prefix</Button>
          <Button loading suffix={<SettingsIcon size={16} />}>Loading with Suffix</Button>
          <Button loading prefix={<SearchIcon size={16} />} suffix={<CheckIcon size={16} />}>Loading Both</Button>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>Disabled States</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button disabled>Disabled</Button>
          <Button disabled prefix={<PlusIcon size={16} />}>Disabled with Prefix</Button>
          <Button disabled suffix={<SettingsIcon size={16} />}>Disabled with Suffix</Button>
          <Button disabled prefix={<SearchIcon size={16} />} suffix={<CheckIcon size={16} />}>Disabled Both</Button>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#666' }}>Shapes with Icons</h4>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button shape="square" prefix={<PlusIcon size={16} />}>Square</Button>
          <Button shape="rounded" prefix={<PlusIcon size={16} />}>Rounded</Button>
          <Button shape="circle" svgOnly><PlusIcon size={16} /></Button>
          <Button shape="square" suffix={<SettingsIcon size={16} />}>Square</Button>
          <Button shape="rounded" suffix={<SettingsIcon size={16} />}>Rounded</Button>
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
