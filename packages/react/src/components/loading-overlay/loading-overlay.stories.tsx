import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "../typography";
import { LoadingOverlay } from "./loading-overlay";

const meta = {
  title: "Components/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    open: { control: "boolean" },
  },
  render: (args) => (
    <div style={{ padding: "24px" }}>
      <Typography type="body">
        업로드가 끝날 때까지 이 화면은 조작할 수 없습니다.
      </Typography>
      <LoadingOverlay {...args} />
    </div>
  ),
} satisfies Meta<typeof LoadingOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true },
};

export const WithMessage: Story = {
  args: { open: true, message: "정산 데이터를 업로드하고 있습니다" },
};

export const WithDescription: Story = {
  args: {
    open: true,
    message: "정산 데이터를 업로드하고 있습니다",
    description: "최대 1분 정도 걸립니다. 창을 닫지 마세요.",
  },
};
