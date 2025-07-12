import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@cocso-ui/react';

const meta = {
  title: 'React/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'text'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs', '2xs'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    color: {
      control: 'color',
    },
    fontWeight: {
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
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
    disabled: false,
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Variants */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="text">Text</Button>
        </div>
      </div>

      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="xl">Extra Large</Button>
          <Button size="lg">Large</Button>
          <Button size="md">Medium</Button>
          <Button size="sm">Small</Button>
          <Button size="xs">Extra Small</Button>
          <Button size="2xs">2X Small</Button>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>States</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </div>
    </div>
  ),
}; 