import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@cocso-ui/react';
import { PlusIcon, SearchIcon, SettingsIcon, CheckIcon } from '@cocso-ui/react-icons';

const meta = {
  title: 'react/Button',
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
    type: {
      description: '버튼의 스타일 타입',
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: '버튼의 크기',
      control: 'select',
      options: ['tiny', 'small', 'medium', 'large'],
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    shape: {
      description: '버튼의 모양',
      control: 'select',
      options: ['square', 'rounded', 'circle'],
      table: {
        defaultValue: { summary: 'square' },
      },
    },
    weight: {
      description: '폰트 굵기',
      control: 'select',
      options: ['thin', 'extraLight', 'light', 'normal', 'medium', 'semiBold', 'bold', 'extraBold', 'black'],
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    prefix: {
      description: '버튼 앞에 표시될 아이콘 또는 요소',
      control: false,
    },
    suffix: {
      description: '버튼 뒤에 표시될 아이콘 또는 요소',
      control: false,
    },
    svgOnly: {
      description: '아이콘만 표시하는 버튼인지 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: '버튼 비활성화 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      description: '로딩 상태 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      description: '다른 컴포넌트로 렌더링할지 여부',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// 버튼 타입별 스토리
export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button type="primary">Primary</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="tertiary">Tertiary</Button>
      <Button type="success">Success</Button>
      <Button type="error">Error</Button>
      <Button type="warning">Warning</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '6가지 버튼 타입을 보여줍니다.',
      },
    },
  },
};

// 버튼 크기별 스토리
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button size="tiny">Tiny</Button>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '4가지 버튼 크기를 보여줍니다.',
      },
    },
  },
};

// 버튼 모양별 스토리
export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="circle" svgOnly><SearchIcon /></Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '3가지 버튼 모양을 보여줍니다.',
      },
    },
  },
};

// 폰트 굵기별 스토리
export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button weight="thin">Thin</Button>
      <Button weight="extraLight">Extra Light</Button>
      <Button weight="light">Light</Button>
      <Button weight="normal">Normal</Button>
      <Button weight="medium">Medium</Button>
      <Button weight="semiBold">Semibold</Button>
      <Button weight="bold">Bold</Button>
      <Button weight="extraBold">Extra Bold</Button>
      <Button weight="black">Black</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '9가지 폰트 굵기를 보여줍니다.',
      },
    },
  },
};

// 아이콘이 있는 버튼
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button prefix={<PlusIcon />}>Add Item</Button>
      <Button suffix={<SettingsIcon />}>Settings</Button>
      <Button prefix={<SearchIcon />} suffix={<CheckIcon />}>Search & Check</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'prefix와 suffix를 사용한 아이콘 버튼을 보여줍니다.',
      },
    },
  },
};

// 아이콘만 있는 버튼
export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button type="primary" svgOnly size="tiny"><PlusIcon /></Button>
      <Button type="secondary" svgOnly size="small"><SearchIcon /></Button>
      <Button type="tertiary" svgOnly size="medium"><SettingsIcon /></Button>
      <Button type="success" svgOnly size="large"><CheckIcon /></Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'svgOnly prop을 사용한 아이콘 전용 버튼을 보여줍니다.',
      },
    },
  },
};

// 버튼 상태
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 다양한 상태를 보여줍니다.',
      },
    },
  },
};

// 모든 변형을 한번에 보여주는 스토리
export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px' }}>
      {/* Button Types */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Button Types</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="primary">Primary</Button>
          <Button type="secondary">Secondary</Button>
          <Button type="tertiary">Tertiary</Button>
          <Button type="success">Success</Button>
          <Button type="error">Error</Button>
          <Button type="warning">Warning</Button>
        </div>
      </div>

      {/* Button Sizes */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Button Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" size="tiny">Tiny</Button>
          <Button type="primary" size="small">Small</Button>
          <Button type="primary" size="medium">Medium</Button>
          <Button type="primary" size="large">Large</Button>
        </div>
      </div>

      {/* Button Shapes */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Button Shapes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="secondary" shape="square">Square</Button>
          <Button type="secondary" shape="rounded">Rounded</Button>
          <Button type="secondary" shape="circle" svgOnly><SearchIcon /></Button>
        </div>
      </div>

      {/* Button States */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Button States</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="primary">Normal</Button>
          <Button type="primary" disabled>Disabled</Button>
          <Button type="primary" loading>Loading</Button>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="primary" prefix={<PlusIcon />}>Add Item</Button>
          <Button type="secondary" suffix={<SettingsIcon />}>Settings</Button>
          <Button type="tertiary" prefix={<SearchIcon />} suffix={<CheckIcon />}>Search & Check</Button>
        </div>
      </div>

      {/* Icon Only Buttons */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Icon Only Buttons</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="primary" svgOnly size="tiny"><PlusIcon /></Button>
          <Button type="primary" svgOnly size="small"><PlusIcon /></Button>
          <Button type="secondary" svgOnly size="medium"><SearchIcon /></Button>
          <Button type="tertiary" svgOnly size="large"><SettingsIcon /></Button>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Font Weights</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button type="primary" weight="thin">Thin</Button>
          <Button type="primary" weight="normal">Normal</Button>
          <Button type="primary" weight="semiBold">Semibold</Button>
          <Button type="primary" weight="bold">Bold</Button>
          <Button type="primary" weight="black">Black</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button 컴포넌트의 모든 변형을 한번에 보여줍니다.',
      },
    },
  },
};

// Playground 스토리 (사용자가 직접 조작 가능)
export const Playground: Story = {
  args: {
    children: 'Playground Button',
    type: 'primary',
    size: 'medium',
    shape: 'square',
    weight: 'medium',
    disabled: false,
    loading: false,
    svgOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Controls 패널을 사용하여 버튼의 모든 속성을 직접 조작해볼 수 있습니다.',
      },
    },
  },
};
