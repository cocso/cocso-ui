import type { Meta, StoryObj } from '@storybook/react';
import { Body } from '@cocso-ui/react';

const meta = {
  title: 'Components/Body',
  component: Body,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'a', 'span', 'div', 'label', 'li', 'td', 'th', 'figcaption', 'blockquote', 'cite'],
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm', 'xs'],
    },
    color: {
      control: 'color',
    },
    fontWeight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
  },
} satisfies Meta<typeof Body>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is body text rendered with the Body component.',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large body text for emphasis and better readability.',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium body text for general content.',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small body text for secondary information.',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra small body text for captions and metadata.',
  },
};

export const AsLink: Story = {
  args: {
    as: 'a',
    children: 'This is a link using Body component',
  },
};

export const AsSpan: Story = {
  args: {
    as: 'span',
    children: 'This is inline text using Body component',
  },
};

export const AsLabel: Story = {
  args: {
    as: 'label',
    children: 'Form Label',
  },
};

export const AsBlockquote: Story = {
  args: {
    as: 'blockquote',
    children: 'This is a quote using Body component for proper semantic meaning.',
  },
};

export const WithCustomColor: Story = {
  args: {
    color: '#7C3AED',
    children: 'Custom colored body text',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Body size="lg">Large body text</Body>
      <Body size="md">Medium body text</Body>
      <Body size="sm">Small body text</Body>
      <Body size="xs">Extra small body text</Body>
    </div>
  ),
};

export const Article: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Body size="lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua.
      </Body>
      <Body size="md">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit 
        esse cillum dolore eu fugiat nulla pariatur.
      </Body>
      <Body size="sm" color="#6B7280">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
        mollit anim id est laborum.
      </Body>
    </div>
  ),
};

export const FormElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Body as="label" fontWeight="medium">
        Email Address
      </Body>
      <Body as="span" size="sm" color="#6B7280">
        We'll never share your email with anyone else.
      </Body>
      <Body as="a" href="#" color="#2563EB">
        Forgot your password?
      </Body>
    </div>
  ),
};

export const SemanticElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Body as="p">
        This is a paragraph element with semantic meaning.
      </Body>
      <Body as="blockquote" style={{ borderLeft: '4px solid #E5E7EB', paddingLeft: '16px' }}>
        "This is a blockquote with proper semantic structure."
      </Body>
      <Body as="cite" size="sm" color="#6B7280">
        — Citation source
      </Body>
      <Body as="figcaption" size="xs" color="#9CA3AF">
        Figure caption text
      </Body>
    </div>
  ),
}; 