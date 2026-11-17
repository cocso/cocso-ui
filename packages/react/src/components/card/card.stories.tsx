import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Card } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled", "glass"],
    },
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

/**
 * Glass over something worth seeing through. A gradient rather than an image
 * so the baseline is deterministic.
 */
export const Glass: Story = {
  render: () => (
    <div
      style={{
        padding: 32,
        background:
          "linear-gradient(135deg, var(--cocso-color-info-500), var(--cocso-color-success-500))",
        borderRadius: "var(--cocso-radius-5)",
      }}
    >
      <Card variant="glass" style={{ width: 240 }}>
        Glass
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

/**
 * `Card.Header` keeps one height whether or not an action sits on its end;
 * `gap` spaces the card's children.
 */
export const Composed: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <Card gap={16} style={{ width: 240 }} variant="outlined">
        <Card.Header>
          <Card.Title>Monthly revenue</Card.Title>
          <Button size="small" variant="secondary">
            Export
          </Button>
        </Card.Header>
        <span>First line</span>
        <span>Second line</span>
      </Card>
      <Card gap={16} style={{ width: 240 }} variant="outlined">
        <Card.Header>
          <Card.Title>No action</Card.Title>
        </Card.Header>
        <span>First line</span>
        <span>Second line</span>
      </Card>
    </div>
  ),
};

/** `render` swaps the element — here a button, so the whole card is the control. */
export const AsButton: Story = {
  render: () => (
    <Card
      gap={8}
      render={<button type="button" />}
      style={{ width: 240, textAlign: "start", font: "inherit" }}
      variant="outlined"
    >
      <strong>Notice group</strong>
      <span>Submitted on 2026-01-05</span>
    </Card>
  ),
};
