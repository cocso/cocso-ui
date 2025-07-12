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

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* All Sizes */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Body size="lg">Large body text</Body>
          <Body size="md">Medium body text</Body>
          <Body size="sm">Small body text</Body>
          <Body size="xs">Extra small body text</Body>
        </div>
      </div>

      {/* Semantic Elements */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Semantic Elements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Body as="p">Paragraph element with semantic meaning</Body>
          <Body as="a" href="#" color="#2563EB">Link element</Body>
          <Body as="label" fontWeight="medium">Form label</Body>
          <Body as="span" size="sm" color="#6B7280">Inline text</Body>
          <Body as="blockquote" style={{ borderLeft: '4px solid #E5E7EB', paddingLeft: '16px' }}>
            Blockquote with proper semantic structure
          </Body>
        </div>
      </div>

      {/* Article Example */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Article Example</h3>
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
      </div>
    </div>
  ),
}; 