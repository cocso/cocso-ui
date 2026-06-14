import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
  args: {
    variant: "info",
    children: "This is an alert message.",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Alert variant="info">Info: Something you should know.</Alert>
      <Alert variant="success">Success: Operation completed.</Alert>
      <Alert variant="warning">Warning: Please review carefully.</Alert>
      <Alert variant="error">Error: Something went wrong.</Alert>
    </div>
  ),
};

export const WithClose: Story = {
  args: {
    children: "This alert can be dismissed.",
    onClose: () => {},
  },
};
