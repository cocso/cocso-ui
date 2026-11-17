import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "./copy-button";

const meta = {
  title: "Components/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    resetTimeoutSeconds: { control: "number" },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "ck_live_0000000000" },
};

/** Beside the value it copies — the way it is used in tables and settings. */
export const BesideAValue: Story = {
  args: { text: "ck_live_0000000000" },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <code>{args.text}</code>
      <CopyButton {...args} />
    </div>
  ),
};

export const CustomLabels: Story = {
  args: {
    copiedLabel: "Copied",
    label: "Copy link",
    text: "https://example.com/entrust?hash=0000",
  },
};

export const Disabled: Story = {
  args: { disabled: true, text: "ck_live_0000000000" },
};
