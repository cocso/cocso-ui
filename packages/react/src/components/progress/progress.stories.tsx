import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
  args: {
    size: "md",
    value: 60,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: 300,
      }}
    >
      <Progress size="sm" value={40} />
      <Progress size="md" value={60} />
      <Progress size="lg" value={80} />
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: 300,
      }}
    >
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};
