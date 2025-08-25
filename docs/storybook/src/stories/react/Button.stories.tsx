import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@cocso-ui/react';
import { PlusIcon, SearchIcon, SettingsIcon } from '@cocso-ui/react-icons';

const meta = {
  title: 'react/button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning'],
    },
    size: {
      control: 'select',
      options: ['tiny', 'small', 'medium', 'large'],
    },
    shape: {
      control: 'select',
      options: ['square', 'rounded', 'circle'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    svgOnly: {
      control: 'boolean',
    },
    weight: {
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
    },
    asChild: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'primary',
    children: 'Button',
    size: 'medium',
  },
};

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
    size: 'medium',
  },
};

export const Secondary: Story = {
  args: {
    type: 'secondary',
    children: 'Secondary Button',
    size: 'medium',
  },
};

export const Tertiary: Story = {
  args: {
    type: 'tertiary',
    children: 'Tertiary Button',
    size: 'medium',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    children: 'Success Button',
    size: 'medium',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    children: 'Error Button',
    size: 'medium',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    children: 'Warning Button',
    size: 'medium',
  },
};

export const Tiny: Story = {
  args: {
    type: 'primary',
    children: 'Tiny Button',
    size: 'tiny',
  },
};

export const Small: Story = {
  args: {
    type: 'primary',
    children: 'Small Button',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    type: 'primary',
    children: 'Medium Button',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    type: 'primary',
    children: 'Large Button',
    size: 'large',
  },
};

export const WithIcons: Story = {
  args: {
    type: 'primary',
    prefix: <PlusIcon />,
    children: 'Add Item',
    size: 'medium',
  },
};

export const IconOnly: Story = {
  args: {
    type: 'secondary',
    children: <SettingsIcon />,
    svgOnly: true,
    size: 'medium',
  },
};

export const Loading: Story = {
  args: {
    type: 'primary',
    children: 'Loading...',
    loading: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    type: 'primary',
    children: 'Disabled Button',
    disabled: true,
    size: 'medium',
  },
};

export const Rounded: Story = {
  args: {
    type: 'primary',
    children: 'Rounded Button',
    shape: 'rounded',
    size: 'medium',
  },
};

export const Circle: Story = {
  args: {
    type: 'secondary',
    children: <SearchIcon />,
    shape: 'circle',
    svgOnly: true,
    size: 'medium',
  },
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button type="primary" weight="thin">Thin Weight</Button>
        <Button type="primary" weight="extralight">Extra Light</Button>
        <Button type="primary" weight="light">Light</Button>
        <Button type="primary" weight="normal">Normal</Button>
        <Button type="primary" weight="medium">Medium</Button>
        <Button type="primary" weight="semibold">Semibold</Button>
        <Button type="primary" weight="bold">Bold</Button>
        <Button type="primary" weight="extrabold">Extra Bold</Button>
        <Button type="primary" weight="black">Black</Button>
      </div>
    </div>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Button Types</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary">Primary</Button>
          <Button type="secondary">Secondary</Button>
          <Button type="tertiary">Tertiary</Button>
          <Button type="success">Success</Button>
          <Button type="error">Error</Button>
          <Button type="warning">Warning</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Button Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" size="tiny">Tiny</Button>
          <Button type="primary" size="small">Small</Button>
          <Button type="primary" size="medium">Medium</Button>
          <Button type="primary" size="large">Large</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Button Shapes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="secondary" shape="square">Square</Button>
          <Button type="secondary" shape="rounded">Rounded</Button>
          <Button type="secondary" shape="circle" svgOnly><SearchIcon /></Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Button States</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary">Normal</Button>
          <Button type="primary" disabled>Disabled</Button>
          <Button type="primary" loading>Loading</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" prefix={<PlusIcon />}>Add Item</Button>
          <Button type="secondary" suffix={<SettingsIcon />}>Settings</Button>
          <Button type="tertiary" prefix={<SearchIcon />} suffix={<SettingsIcon />}>Search & Settings</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Icon Only Buttons</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" svgOnly size="tiny"><PlusIcon /></Button>
          <Button type="primary" svgOnly size="small"><PlusIcon /></Button>
          <Button type="secondary" svgOnly size="medium"><SettingsIcon /></Button>
          <Button type="tertiary" svgOnly size="large"><SearchIcon /></Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Font Weights</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" weight="thin">Thin</Button>
          <Button type="primary" weight="normal">Normal</Button>
          <Button type="primary" weight="semibold">Semibold</Button>
          <Button type="primary" weight="bold">Bold</Button>
          <Button type="primary" weight="black">Black</Button>
        </div>
      </div>
    </div>
  ),
};
