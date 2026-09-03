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
    // A data URI, not a remote image. This story has a committed pixel
    // baseline, and a network fetch makes it depend on a service being up
    // and serving byte-identical output — the same hazard as a story
    // rendering `new Date()`, and it failed the same way.
    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNjZGQxZDUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjU4IiByPSIyNiIgZmlsbD0iIzU4NjE2YSIvPjxwYXRoIGQ9Ik0yMCAxNTBjMC0zMCAyNS00NiA1NS00NnM1NSAxNiA1NSA0NnoiIGZpbGw9IiM1ODYxNmEiLz48L3N2Zz4=",
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
