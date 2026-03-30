import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular"],
    },
    animation: { control: "select", options: ["pulse", "wave", "none"] },
  },
  args: {
    variant: "text",
    animation: "pulse",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <Skeleton style={{ width: 200 }} variant="text" />
      <Skeleton variant="circular" />
      <Skeleton style={{ width: 200 }} variant="rectangular" />
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: 300,
      }}
    >
      <Skeleton animation="pulse" variant="text" />
      <Skeleton animation="wave" variant="text" />
      <Skeleton animation="none" variant="text" />
    </div>
  ),
};

export const ContentPlaceholder: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", width: 300 }}>
      <Skeleton variant="circular" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton variant="text" />
        <Skeleton style={{ width: "60%" }} variant="text" />
      </div>
    </div>
  ),
};
