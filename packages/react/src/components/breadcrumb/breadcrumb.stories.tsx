import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    size: "md",
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <a href="#">Home</a>
      <a href="#">Products</a>
      <span>Detail</span>
    </Breadcrumb>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Breadcrumb size="sm">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <span>Detail</span>
      </Breadcrumb>
      <Breadcrumb size="md">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <span>Detail</span>
      </Breadcrumb>
      <Breadcrumb size="lg">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <span>Detail</span>
      </Breadcrumb>
    </div>
  ),
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator="›">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <span>Current</span>
    </Breadcrumb>
  ),
};
