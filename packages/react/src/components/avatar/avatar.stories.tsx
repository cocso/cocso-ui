import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["circle", "square"] },
  },
  args: {
    size: "md",
    shape: "circle",
    fallback: "A",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=avatar",
    alt: "User avatar",
    fallback: undefined,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Avatar fallback="A" size="xs" />
      <Avatar fallback="A" size="sm" />
      <Avatar fallback="A" size="md" />
      <Avatar fallback="A" size="lg" />
      <Avatar fallback="A" size="xl" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Avatar fallback="C" shape="circle" />
      <Avatar fallback="S" shape="square" />
    </div>
  ),
};
