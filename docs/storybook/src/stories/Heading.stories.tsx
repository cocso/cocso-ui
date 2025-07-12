import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '@cocso-ui/react';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs', '2xs'],
    },
    color: {
      control: 'color',
    },
    fontWeight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Heading Component',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Heading',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Heading',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Heading',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Heading',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small Heading',
  },
};

export const AsH1: Story = {
  args: {
    as: 'h1',
    children: 'H1 Heading',
  },
};

export const AsH3: Story = {
  args: {
    as: 'h3',
    children: 'H3 Heading',
  },
};

export const WithCustomColor: Story = {
  args: {
    color: '#059669',
    children: 'Custom Color Heading',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Heading size="xl">Extra Large Heading</Heading>
      <Heading size="lg">Large Heading</Heading>
      <Heading size="md">Medium Heading</Heading>
      <Heading size="sm">Small Heading</Heading>
      <Heading size="xs">Extra Small Heading</Heading>
      <Heading size="2xs">2X Small Heading</Heading>
    </div>
  ),
};

export const SemanticHierarchy: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Heading as="h1" size="xl">Main Title (H1)</Heading>
      <Heading as="h2" size="lg">Section Title (H2)</Heading>
      <Heading as="h3" size="md">Subsection Title (H3)</Heading>
      <Heading as="h4" size="sm">Minor Title (H4)</Heading>
      <Heading as="h5" size="xs">Small Title (H5)</Heading>
      <Heading as="h6" size="2xs">Tiny Title (H6)</Heading>
    </div>
  ),
}; 