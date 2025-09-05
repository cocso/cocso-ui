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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="success">Success</Button>
        <Button variant="error">Error</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="neutral">Neutral</Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button size="md">MD</Button>
        <Button size="lg">LG</Button>
        <Button size="xl">XL</Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button prefix={<PlusIcon />}>With Prefix</Button>
        <Button suffix={<SettingsIcon />}>With Suffix</Button>
        <Button prefix={<SearchIcon />} suffix={<CheckIcon />}>
          Both Icons
        </Button>
        <Button svgOnly>
          <PlusIcon />
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
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
