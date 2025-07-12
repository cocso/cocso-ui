import type { Meta, StoryObj } from '@storybook/react';
import { Display } from '@cocso-ui/react';

const meta = {
  title: 'React/Display',
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

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Display size="lg">Large Display</Display>
          <Display size="md">Medium Display</Display>
          <Display size="sm">Small Display</Display>
        </div>
      </div>

      {/* Hero Section Example */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Hero Section Example</h3>
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
      </div>
    </div>
  ),
}; 