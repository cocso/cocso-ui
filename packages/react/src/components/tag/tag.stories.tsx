import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["solid", "subtle", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    variant: "subtle",
    size: "md",
    children: "Tag",
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Tag variant="solid">Solid</Tag>
      <Tag variant="subtle">Subtle</Tag>
      <Tag variant="outline">Outline</Tag>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};

export const Removable: Story = {
  args: {
    children: "Removable",
    onRemove: () => {},
  },
};
