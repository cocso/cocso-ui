import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["elevated", "outlined", "filled"] },
    padding: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    variant: "elevated",
    padding: "md",
    children: "Card content",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <Card variant="elevated" style={{ width: 200 }}>
        Elevated
      </Card>
      <Card variant="outlined" style={{ width: 200 }}>
        Outlined
      </Card>
      <Card variant="filled" style={{ width: 200 }}>
        Filled
      </Card>
    </div>
  ),
};

export const Paddings: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <Card padding="sm" variant="outlined">
        Small padding
      </Card>
      <Card padding="md" variant="outlined">
        Medium padding
      </Card>
      <Card padding="lg" variant="outlined">
        Large padding
      </Card>
    </div>
  ),
};
