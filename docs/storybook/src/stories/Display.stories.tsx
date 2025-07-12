import type { Meta, StoryObj } from '@storybook/react';
import { Display } from '@cocso-ui/react';

const meta = {
  title: 'Components/Display',
  component: Display,
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
      options: ['lg', 'md', 'sm'],
    },
    color: {
      control: 'color',
    },
    fontWeight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Display>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Display Text',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Display Text',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Display Text',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Display Text',
  },
};

export const AsH1: Story = {
  args: {
    as: 'h1',
    children: 'Display as H1',
  },
};

export const AsH2: Story = {
  args: {
    as: 'h2',
    children: 'Display as H2',
  },
};

export const WithCustomColor: Story = {
  args: {
    color: '#DC2626',
    children: 'Custom Color Display',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Display size="lg">Large Display</Display>
      <Display size="md">Medium Display</Display>
      <Display size="sm">Small Display</Display>
    </div>
  ),
};

export const HeroSection: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px', 
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <Display as="h1" size="lg" color="#1F2937">
        Welcome to COCSO UI
      </Display>
      <Display as="h2" size="md" color="#6B7280">
        A modern design system for React
      </Display>
      <Display as="h3" size="sm" color="#9CA3AF">
        Built with TypeScript and Tailwind CSS
      </Display>
    </div>
  ),
};

export const ProductHeader: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px',
      maxWidth: '600px'
    }}>
      <Display as="h1" size="lg">
        Product Name
      </Display>
      <Display as="h2" size="md" color="#4B5563">
        Premium quality product with exceptional features
      </Display>
    </div>
  ),
}; 